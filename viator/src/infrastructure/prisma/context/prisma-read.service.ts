import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/read-client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PrismaReadService — Cliente de solo lectura contra PostgreSQL.
 *
 * Se conecta a la réplica PostgreSQL sincronizada vía SymmetricDS.
 * Usar SOLO para operaciones de lectura (findUnique, findMany, etc.).
 * Las escrituras deben ir siempre a través de PrismaService (MySQL).
 */
@Injectable()
export class PrismaReadService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaReadService.name);

  constructor() {
    const connectionString =
      process.env.READ_DATABASE_URL ??
      'postgresql://viator_read_user:viator_read_password@localhost:5433/viator_read_db';

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to PostgreSQL read replica');
    } catch (error) {
      this.logger.warn(
        '⚠️  Could not connect to PostgreSQL read replica. Read queries will not be available.',
        error instanceof Error ? error.message : error,
      );
    }
  }
}
