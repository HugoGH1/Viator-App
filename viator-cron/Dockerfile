# =============================================================================
# Dockerfile - NestJS Cron Worker
# Contexto de construcción: Raíz del proyecto (.)
# =============================================================================

FROM node:22-alpine

WORKDIR /usr/src/app

# -------------------------------------------------------------------
# Copiar dependencias del cron
# -------------------------------------------------------------------
COPY viator-cron/package*.json ./

# -------------------------------------------------------------------
# Copiar los schemas de Prisma DESDE la API principal
# Esto evita tener que duplicar archivos físicos en el repositorio.
# -------------------------------------------------------------------
COPY viator/prisma ./prisma/
COPY viator/prisma.config.ts ./
COPY viator/prisma-read.config.ts ./

# -------------------------------------------------------------------
# Instalar dependencias
# -------------------------------------------------------------------
RUN npm ci

# -------------------------------------------------------------------
# Generar clientes Prisma usando los schemas importados
# -------------------------------------------------------------------
RUN npx prisma generate
RUN npx prisma generate --config=./prisma-read.config.ts

# -------------------------------------------------------------------
# Copiar código fuente del cron
# -------------------------------------------------------------------
COPY viator-cron .

# -------------------------------------------------------------------
# Compilar el cron
# -------------------------------------------------------------------
RUN npm run build

# -------------------------------------------------------------------
# Iniciar el worker de Cron
# (No expone puertos porque corre en background)
# -------------------------------------------------------------------
CMD ["npm", "run", "start:dev"]
