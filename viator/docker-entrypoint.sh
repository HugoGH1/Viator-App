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
# Solucion: Intentar migrate deploy. Si falla, hacer baseline
# marcando las migraciones existentes como "ya aplicadas", y
# luego re-ejecutar migrate deploy.
# -------------------------------------------------------------------

echo "[1/2] Ejecutando prisma migrate deploy..."

if npx prisma migrate deploy 2>&1; then
  echo "  Migraciones aplicadas correctamente."
else
  echo "  migrate deploy fallo (P3005: schema no vacio por tablas sym_*)."
  echo "  Haciendo baseline de migraciones existentes..."

  # prisma migrate resolve crea _prisma_migrations si no existe
  # y marca la migracion como ya aplicada (baseline)
  npx prisma migrate resolve --applied 20260503035737_init_mysql
  npx prisma migrate resolve --applied 20260503071533_new_role_added

  echo "  Baseline completo. Re-ejecutando migrate deploy..."
  npx prisma migrate deploy

  echo "  Migraciones aplicadas tras baseline."
fi

echo "[2/2] Iniciando NestJS..."
exec npm run start:dev
