# =============================================================================
# Dockerfile - NestJS API (Development / Testing)
# Configura automáticamente:
# - Prisma MySQL (primary)
# - Prisma PostgreSQL replica schema
# - Generación de clientes Prisma
# - Migraciones
# =============================================================================

FROM node:22-alpine

WORKDIR /usr/src/app

# -------------------------------------------------------------------
# Copiar archivos de dependencias primero (cache layer)
# -------------------------------------------------------------------
COPY package*.json ./

COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY prisma-read.config.ts ./

# -------------------------------------------------------------------
# Instalar dependencias
# -------------------------------------------------------------------
RUN npm ci

# -------------------------------------------------------------------
# Copiar código fuente
# -------------------------------------------------------------------
COPY . .

# -------------------------------------------------------------------
# Generar cliente Prisma principal (MySQL)
# -------------------------------------------------------------------
RUN npx prisma generate

# -------------------------------------------------------------------
# Generar cliente Prisma read replica (PostgreSQL)
# -------------------------------------------------------------------
RUN npx prisma generate --config=./prisma-read.config.ts

# -------------------------------------------------------------------
# Puerto API
# -------------------------------------------------------------------
EXPOSE 3000

# -------------------------------------------------------------------
# Startup automático
#
# 1. Esperar infraestructura
# 2. Crear schema PostgreSQL replica
# 3. Ejecutar migraciones MySQL
# 4. Iniciar NestJS
# -------------------------------------------------------------------
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]