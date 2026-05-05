import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      user: process.env.DB_USER ?? 'viator_user',
      password: process.env.DB_PASSWORD ?? 'viator_password',
      database: process.env.DB_NAME ?? 'viator_db',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
