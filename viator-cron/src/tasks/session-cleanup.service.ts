import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import * as mysql from 'mysql2/promise';
import { Client } from 'pg';
import { Temporal } from "@js-temporal/polyfill";

@Injectable()
export class SessionCleanupService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(SessionCleanupService.name);
    private writeDb: mysql.Connection | null = null;
    private readDb: Client | null = null;
    private queue: string[] = []; // Encola las referencias de tiempo de los intentos

    async onModuleInit() {
        // Conexión a la bd de escritura (Master)
        try {
            this.writeDb = await mysql.createConnection(process.env.DATABASE_URL!);
            this.logger.log('Conectado a la bd principal (MySQL) para escritura.');
        } catch (error) {
            this.logger.warn('No se pudo conectar a la bd principal (MySQL) al iniciar.');
        }

        // Conexión a la bd de lectura (Réplica)
        try {
            this.readDb = new Client({ connectionString: process.env.READ_DATABASE_URL });
            await this.readDb.connect();
            this.logger.log('Conectado a la bd de réplica (PostgreSQL) para lectura.');
        } catch (error) {
            this.logger.warn('No se pudo conectar a la bd de réplica (PostgreSQL) al iniciar.');
        }
    }

    async onModuleDestroy() {
        if (this.writeDb) await this.writeDb.end();
        if (this.readDb) await this.readDb.end();
    }

    // Ejecutar cada 2 minutos
    @Cron('0 */2 * * * *')
    async handleCleanup() {
        const nowUtc = Temporal.Now.instant().toString();
        this.logger.log(`Añadiendo a la cola la tarea de limpieza. Referencia UTC: ${nowUtc}`);
        this.queue.push(nowUtc);
        this.processQueue();
    }

    // Intentamos procesar la cola frecuentemente por si las bd se levantaron
    @Cron(CronExpression.EVERY_MINUTE)
    async processQueue() {
        if (this.queue.length === 0) return;

        // Comprobar disponibilidad de la réplica (para cumplir CQRS)
        try {
            if (!this.readDb) {
                this.readDb = new Client({ connectionString: process.env.READ_DATABASE_URL });
                await this.readDb.connect();
            } else {
                await this.readDb.query('SELECT 1');
            }
        } catch (error) {
            this.logger.warn('La bd de réplica (PostgreSQL) está detenida. Se encola la tarea.');
            this.readDb = null;
            return;
        }

        // Comprobar disponibilidad del master para escribir
        try {
            if (!this.writeDb) {
                this.writeDb = await mysql.createConnection(process.env.DATABASE_URL!);
            } else {
                await this.writeDb.query('SELECT 1');
            }
        } catch (error) {
            this.logger.warn('La bd principal (MySQL) está detenida. Se encola la tarea.');
            this.writeDb = null;
            return;
        }

        this.logger.log(`Procesando ${this.queue.length} ejecución(es) encolada(s)...`);

        while (this.queue.length > 0) {
            const task = this.queue[0];
            try {
                // PASO 1: Leer de la réplica (PostgreSQL) qué sesiones expiraron
                const readQuery = `SELECT "id" FROM "Session" WHERE "expiresAt" < $1;`;
                const readResult = await this.readDb.query(readQuery, [task]);
                const expiredIds = readResult.rows.map(row => row.id);

                if (expiredIds.length > 0) {
                    // PASO 2: Borrar en la base de datos principal (MySQL)
                    const placeholders = expiredIds.map(() => '?').join(',');
                    const deleteQuery = `DELETE FROM \`Session\` WHERE \`id\` IN (${placeholders});`;
                    const [writeResult] = await this.writeDb.query(deleteQuery, expiredIds);
                    const affectedRows = (writeResult as any).affectedRows || 0;
                    this.logger.log(`Éxito (${task}): ${affectedRows} sesiones eliminadas en master (MySQL) tras leer de réplica (Postgres).`);
                } else {
                    this.logger.log(`Éxito (${task}): 0 sesiones expiradas encontradas en la réplica.`);
                }

                this.queue.shift(); // Quitamos de la cola si tuvo éxito
            } catch (error) {
                this.logger.error(`Error procesando ${task}:`, error);
                break; // Paramos el while y lo intentamos en el siguiente ciclo
            }
        }
    }
}
