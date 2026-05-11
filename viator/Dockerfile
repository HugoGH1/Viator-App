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
# 1. Gestionar migraciones MySQL (con soporte para baseline)
#    SymmetricDS crea tablas sym_* antes de que Prisma arranque,
#    lo que causa P3005 ("schema is not empty") en deploy limpio.
#    El script detecta esto y hace baseline automáticamente.
# 2. Iniciar NestJS
# -------------------------------------------------------------------
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]