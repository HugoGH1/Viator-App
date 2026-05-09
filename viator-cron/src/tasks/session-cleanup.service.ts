import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaReadService } from "src/prisma/prisma-read.service";
import { Temporal } from "@js-temporal/polyfill";
@Injectable()
export class SessionCleanupService {

    private readonly logger = new Logger(SessionCleanupService.name);

    constructor(
        private prismaMaster: PrismaService,
        private prismaRead: PrismaReadService
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCleanup() {
        const nowUtc = Temporal.Now.instant().toString();

        this.logger.log(`Ejecutando limpieza. Referencia UTC: ${nowUtc}`);

        try {
            const result = await this.prismaMaster.session.deleteMany({
                where: {
                    expiresAt: {
                        lt: nowUtc
                    }
                }
            });

            if (result.count > 0) {
                this.logger.log(`Éxito: ${result.count} sesiones eliminadas.`);
            }
        } catch (error) {
            this.logger.error('Error en el proceso de limpieza:', error);
        }
    }
}