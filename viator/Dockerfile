# =============================================================================
# Dockerfile para desarrollo local / ambiente de pruebas
# Usa start:dev (hot reload con --watch)
#
# Para producción, considerar multi-stage con start:prod
# =============================================================================
FROM node:22-alpine

WORKDIR /usr/src/app

# Copia manifiestos de dependencias primero (aprovecha la caché de Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS las dependencias (incluidas devDependencies para compilar en --watch)
RUN npm ci

# Genera el cliente de Prisma
RUN npx prisma generate

# Copia el resto del código fuente
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Aplica migraciones pendientes y luego levanta la app en modo desarrollo (hot reload)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
