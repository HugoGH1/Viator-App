-- =============================================================================
-- PostgreSQL Init - Schema para réplica de lectura
-- Crea las tablas que SymmetricDS necesita como destino
-- =============================================================================

-- Crear tipo enum si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM (
      'USER',
      'ADMIN',
      'SUPER_ADMIN'
    );
  END IF;
END$$;

-- Crear tabla User si no existe
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "role" TEXT NOT NULL DEFAULT 'USER'
);

-- Crear tabla Session si no existe
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,

  CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
);