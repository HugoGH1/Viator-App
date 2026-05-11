#!/bin/sh
set -e

echo "========================================"
echo "  viator-api - Prisma Migration Handler"
echo "========================================"

# -------------------------------------------------------------------
# Problema: SymmetricDS crea tablas sym_* en MySQL ANTES de que
# Prisma arranque. Cuando Prisma hace migrate deploy en una BD nueva
# (sin tabla _prisma_migrations), ve que el schema no esta vacio
# y falla con error P3005.
#
# Solucion:
# 1. Intentar migrate deploy normalmente
# 2. Si falla (P3005), usar db push para crear tablas del schema
# 3. Marcar migraciones como "applied" (baseline) para que
#    futuros migrate deploy funcionen correctamente
# -------------------------------------------------------------------

echo "[1/2] Ejecutando prisma migrate deploy..."

if npx prisma migrate deploy 2>&1; then
  echo "  Migraciones aplicadas correctamente."
else
  echo "  migrate deploy fallo (P3005: schema no vacio por tablas sym_*)."
  echo "  Creando tablas con db push + baseline..."

  # db push lee el schema.prisma y crea/actualiza SOLO las tablas
  # definidas ahi (User, Session). Ignora las tablas sym_* porque
  # no estan en el schema de Prisma.
  npx prisma db push --skip-generate

  # Ahora marcar las migraciones como "ya aplicadas" (baseline)
  # para que futuros migrate deploy no intenten re-crearlas
  npx prisma migrate resolve --applied 20260503035737_init_mysql
  npx prisma migrate resolve --applied 20260503071533_new_role_added

  echo "  Schema creado y baseline completo."
fi

echo "[2/2] Iniciando NestJS..."
exec npm run start:dev
