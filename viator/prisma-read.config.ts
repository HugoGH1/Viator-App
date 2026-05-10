// =============================================================================
// Prisma Config - Read Replica (PostgreSQL)
//
// Configuración separada para el cliente de solo lectura.
// Usado con: npx prisma generate --config=./prisma-read.config.ts
// =============================================================================
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.read.prisma',
  datasource: {
    url: process.env.READ_DATABASE_URL,
  },
});
