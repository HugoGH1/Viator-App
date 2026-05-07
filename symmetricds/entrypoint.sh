#!/bin/sh
set -e

echo "==========================================="
echo "  SymmetricDS - Viator Replication Engine"
echo "==========================================="

MYSQL_HOST="viator-mysql"
MYSQL_DB="viator_db"
MYSQL_USER="root"
MYSQL_PASSWORD="viator_root_password"

MYSQL_CMD="mysql --skip-ssl -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD"

# -------------------------------------------------------------------
# Esperar MySQL
# -------------------------------------------------------------------
wait_for_mysql() {

  echo "[init] Esperando MySQL..."

  local retries=30

  while [ $retries -gt 0 ]; do

    if $MYSQL_CMD -D "$MYSQL_DB" -e "SELECT 1"; then
      echo "[init] MySQL listo."
      return 0
    fi

    retries=$((retries - 1))

    echo "[init] MySQL no disponible... ($retries restantes)"
    sleep 3
  done

  echo "[error] MySQL no respondió."
  exit 1
}

# -------------------------------------------------------------------
# Esperar PostgreSQL replica
# -------------------------------------------------------------------
wait_for_postgres() {

  echo "[init] Esperando PostgreSQL replica..."

  local retries=30

  while [ $retries -gt 0 ]; do

    if nc -z viator-postgres-read 5432 >/dev/null 2>&1; then
      echo "[init] PostgreSQL replica listo."
      return 0
    fi

    retries=$((retries - 1))

    echo "[init] PostgreSQL no disponible... ($retries restantes)"
    sleep 3
  done

  echo "[error] PostgreSQL replica no respondió."
  exit 1
}

# -------------------------------------------------------------------
# Esperar tablas internas SymmetricDS
# -------------------------------------------------------------------
wait_for_sym_tables() {

  echo "[init] Esperando tablas SymmetricDS..."

  local retries=40

  while [ $retries -gt 0 ]; do

    result=$(
      $MYSQL_CMD "$MYSQL_DB" -N -e "
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema='$MYSQL_DB'
        AND table_name='sym_node_group';
      " 2>/dev/null || echo "0"
    )

    if [ "$result" = "1" ]; then
      echo "[init] Tablas SymmetricDS detectadas."
      return 0
    fi

    retries=$((retries - 1))

    echo "[init] Tablas aún no creadas... ($retries restantes)"
    sleep 5
  done

  echo "[error] SymmetricDS no creó tablas."
  exit 1
}

# -------------------------------------------------------------------
# 1. Esperar infraestructura
# -------------------------------------------------------------------
wait_for_mysql
wait_for_postgres

# -------------------------------------------------------------------
# 2. Iniciar SymmetricDS
# -------------------------------------------------------------------
echo "[init] Iniciando SymmetricDS..."

/opt/symmetric-ds/bin/sym \
  --port 31415 \
  --no-log-console &

SYM_PID=$!

# -------------------------------------------------------------------
# 3. Esperar bootstrap interno
# -------------------------------------------------------------------
sleep 25

wait_for_sym_tables

# -------------------------------------------------------------------
# 4. Verificar si YA se aplicó init-config.sql
#
# IMPORTANTE:
# NO validar sym_node_group porque SymmetricDS
# la crea automáticamente.
#
# Validamos un trigger nuestro.
# -------------------------------------------------------------------
CONFIGURED=$(
  $MYSQL_CMD "$MYSQL_DB" -N -e "
    SELECT COUNT(*)
    FROM sym_trigger
    WHERE trigger_id='trigger_user';
  " 2>/dev/null || echo "0"
)

# -------------------------------------------------------------------
# 5. Aplicar configuración inicial SOLO una vez
# -------------------------------------------------------------------
if [ "$CONFIGURED" = "0" ]; then

  echo "[init] Aplicando configuración inicial..."

  $MYSQL_CMD "$MYSQL_DB" \
    < /opt/symmetric-ds/init/init-config.sql

  echo "[init] Configuración inicial aplicada."

else
  echo "[init] Configuración ya existente."
fi

# -------------------------------------------------------------------
# 6. Sincronizar triggers SIEMPRE
# -------------------------------------------------------------------
echo "[init] Sincronizando triggers..."

/opt/symmetric-ds/bin/symadmin \
  --engine mysql-master \
  sync-triggers

# -------------------------------------------------------------------
# 7. Esperar propagación metadata
# -------------------------------------------------------------------
echo "[init] Esperando propagación metadata..."
sleep 20

# -------------------------------------------------------------------
# 8. Ejecutar initial load
# -------------------------------------------------------------------
echo "[init] Ejecutando initial load..."

/opt/symmetric-ds/bin/symadmin \
  --engine mysql-master \
  reload-node replica-001 || true

echo "[init] Initial load enviado."

echo "==========================================="
echo "  SymmetricDS listo"
echo "==========================================="

# -------------------------------------------------------------------
# Mantener vivo el proceso
# -------------------------------------------------------------------
wait $SYM_PID