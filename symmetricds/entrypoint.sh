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

SYM_HOME="/opt/symmetric-ds"
CONFIG_SQL="$SYM_HOME/init/init-config.sql"

# -------------------------------------------------------------------
# 1. Esperar MySQL
# -------------------------------------------------------------------
wait_for_mysql() {
  echo "[1/6] Esperando MySQL..."
  local retries=60
  while [ $retries -gt 0 ]; do
    if $MYSQL_CMD -D "$MYSQL_DB" -e "SELECT 1" > /dev/null 2>&1; then
      echo "  MySQL listo."
      return 0
    fi
    retries=$((retries - 1))
    echo "  MySQL no disponible... ($retries restantes)"
    sleep 3
  done
  echo "[error] MySQL no respondio."
  exit 1
}

# -------------------------------------------------------------------
# 2. Esperar PostgreSQL replica
# -------------------------------------------------------------------
wait_for_postgres() {
  echo "[2/6] Esperando PostgreSQL replica..."
  local retries=60
  while [ $retries -gt 0 ]; do
    if nc -z viator-postgres-read 5432 > /dev/null 2>&1; then
      echo "  PostgreSQL replica listo."
      return 0
    fi
    retries=$((retries - 1))
    echo "  PostgreSQL no disponible... ($retries restantes)"
    sleep 3
  done
  echo "[error] PostgreSQL replica no respondio."
  exit 1
}

# -------------------------------------------------------------------
# 3. Esperar infraestructura
# -------------------------------------------------------------------
wait_for_mysql
wait_for_postgres

# -------------------------------------------------------------------
# 4. Iniciar SymmetricDS como proceso UNICO (foreground)
#    Lo lanzamos en background para poder seguir con el script
# -------------------------------------------------------------------
echo "[3/6] Iniciando SymmetricDS (mysql-master engine)..."

# Evitar que postgres-replica inicie hasta que la configuracion este lista
if [ -f "$SYM_HOME/engines/postgres-replica.properties" ]; then
  mv $SYM_HOME/engines/postgres-replica.properties $SYM_HOME/postgres-replica.properties.staged
fi

$SYM_HOME/bin/sym \
  --port 31415 &

SYM_PID=$!

# -------------------------------------------------------------------
# 5. Esperar a que SymmetricDS termine su bootstrap
#    Verificamos que la tabla sym_trigger exista en MySQL
#    Esta es la tabla donde necesitamos insertar la configuracion
# -------------------------------------------------------------------
echo "[4/6] Esperando bootstrap de SymmetricDS en MySQL..."

retries=120
while [ $retries -gt 0 ]; do
  # Verificar que sym_trigger existe en MySQL
  SYM_TRIGGER_EXISTS=$(
    $MYSQL_CMD "$MYSQL_DB" -N -e "
      SELECT COUNT(*)
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA='$MYSQL_DB'
        AND TABLE_NAME = 'sym_trigger';
    " 2>/dev/null || echo "0"
  )

  if [ "$SYM_TRIGGER_EXISTS" = "1" ] 2>/dev/null; then
    echo "  Bootstrap completo - tabla sym_trigger encontrada en MySQL."
    break
  fi

  retries=$((retries - 1))
  echo "  Esperando tabla sym_trigger en MySQL... ($retries restantes)"
  sleep 5
done

if [ "$SYM_TRIGGER_EXISTS" != "1" ] 2>/dev/null; then
  echo "[error] Bootstrap no completo despues de 10 minutos."
  exit 1
fi

# Dar un poco mas de tiempo para que terminen de crearse todas las tablas
sleep 10

# -------------------------------------------------------------------
# 6. Aplicar configuracion inicial SOLO si no existe
# -------------------------------------------------------------------
CONFIGURED=$(
  $MYSQL_CMD "$MYSQL_DB" -N -e "
    SELECT COUNT(*)
    FROM sym_trigger
    WHERE trigger_id='trigger_user';
  " 2>/dev/null || echo "0"
)

if [ "$CONFIGURED" = "0" ]; then
  echo "[5/6] Aplicando configuracion inicial..."

  $MYSQL_CMD "$MYSQL_DB" \
    < $CONFIG_SQL

  if [ $? -ne 0 ]; then
    echo "[error] Fallo al aplicar configuracion."
    exit 1
  fi

  echo "  Configuracion aplicada correctamente."

  # Esperar a que SymmetricDS procese la configuracion
  sleep 15

  # Sincronizar triggers en MySQL
  echo "  Sincronizando triggers..."
  $SYM_HOME/bin/symadmin \
    --engine mysql-master \
    sync-triggers

  # Abrir registro para el nodo replica
  echo "  Abriendo registro para replica..."
  $SYM_HOME/bin/symadmin \
    --engine mysql-master \
    open-registration replica replica-001
    
  echo "  Registro abierto. Iniciando motor postgres-replica..."
  
  # Restaurar y arrancar el motor de replica (SymmetricDS lo detectara automaticamente)
  if [ -f "$SYM_HOME/postgres-replica.properties.staged" ]; then
    mv $SYM_HOME/postgres-replica.properties.staged $SYM_HOME/engines/postgres-replica.properties
  fi

  # Esperar a que el nodo replica se registre
  echo "  Esperando registro del nodo replica (30s)..."
  sleep 30

  # Enviar carga inicial
  echo "  Enviando carga inicial..."
  $SYM_HOME/bin/symadmin \
    --engine mysql-master \
    reload-node replica-001

  echo "  Carga inicial enviada."
else
  echo "[5/6] Configuracion ya existente, asegurando que replica este corriendo."
  if [ -f "$SYM_HOME/postgres-replica.properties.staged" ]; then
    mv $SYM_HOME/postgres-replica.properties.staged $SYM_HOME/engines/postgres-replica.properties
  fi
fi

echo "[6/6] SymmetricDS listo y replicando."
echo "==========================================="
echo "  Replicacion MySQL -> PostgreSQL activa"
echo "==========================================="

# -------------------------------------------------------------------
# Mantener vivo el proceso
# -------------------------------------------------------------------
wait $SYM_PID
