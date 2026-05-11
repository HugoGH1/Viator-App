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

REPLICA_PROPS="$SYM_HOME/engines/postgres-replica.properties"
REPLICA_STAGED="$SYM_HOME/postgres-replica.properties.staged"

# -------------------------------------------------------------------
# 1. Esperar MySQL
# -------------------------------------------------------------------
wait_for_mysql() {
  echo "[1/5] Esperando MySQL..."
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
  echo "[2/5] Esperando PostgreSQL replica..."
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
# 4. Detectar si es primera ejecucion o ejecucion subsecuente
#    Miramos si ya existe la tabla sym_trigger en MySQL (la crea
#    SymmetricDS en su bootstrap, existe incluso antes de configurar).
# -------------------------------------------------------------------
SYM_TABLES_EXIST=$(
  $MYSQL_CMD "$MYSQL_DB" -N -e "
    SELECT COUNT(*)
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA='$MYSQL_DB'
      AND TABLE_NAME = 'sym_trigger';
  " 2>/dev/null || echo "0"
)

IS_CONFIGURED=$(
  if [ "$SYM_TABLES_EXIST" = "1" ] 2>/dev/null; then
    $MYSQL_CMD "$MYSQL_DB" -N -e "
      SELECT COUNT(*)
      FROM sym_trigger
      WHERE trigger_id='trigger_user';
    " 2>/dev/null || echo "0"
  else
    echo "0"
  fi
)

# ===================================================================
# RUTA A: Ya configurado previamente → Arrancar con AMBOS motores
# ===================================================================
if [ "$IS_CONFIGURED" != "0" ] 2>/dev/null; then
  echo "[3/5] Configuracion existente detectada."
  echo "[4/5] Nada que configurar."

  # Asegurar que postgres-replica.properties esta en engines/
  if [ -f "$REPLICA_STAGED" ]; then
    mv "$REPLICA_STAGED" "$REPLICA_PROPS"
  fi

  echo "[5/5] Iniciando SymmetricDS con ambos motores..."
  echo "==========================================="
  echo "  Replicacion MySQL -> PostgreSQL activa"
  echo "==========================================="

  # exec reemplaza este proceso → Docker recibe senales correctamente
  exec $SYM_HOME/bin/sym --port 31415
fi

# ===================================================================
# RUTA B: Primera ejecucion → Setup completo
# ===================================================================
echo "[3/5] Primera ejecucion detectada. Configurando..."

# -------------------------------------------------------------------
# 3a. Mover replica fuera para que solo arranque mysql-master
# -------------------------------------------------------------------
if [ -f "$REPLICA_PROPS" ]; then
  mv "$REPLICA_PROPS" "$REPLICA_STAGED"
  echo "  postgres-replica.properties movido a staging."
fi

# -------------------------------------------------------------------
# 3b. Arrancar SymmetricDS TEMPORALMENTE solo con mysql-master
# -------------------------------------------------------------------
echo "  Iniciando SymmetricDS temporal (solo mysql-master)..."

$SYM_HOME/bin/sym --port 31415 &
SYM_PID=$!

# -------------------------------------------------------------------
# 3c. Esperar bootstrap completo (tablas sym_* en MySQL)
# -------------------------------------------------------------------
echo "[4/5] Esperando bootstrap de SymmetricDS..."

retries=120
while [ $retries -gt 0 ]; do
  TABLE_COUNT=$(
    $MYSQL_CMD "$MYSQL_DB" -N -e "
      SELECT COUNT(*)
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA='$MYSQL_DB'
        AND TABLE_NAME IN ('sym_trigger', 'sym_node', 'sym_node_security', 'sym_node_identity');
    " 2>/dev/null || echo "0"
  )

  if [ "$TABLE_COUNT" = "4" ] 2>/dev/null; then
    echo "  Bootstrap completo - 4/4 tablas sym_* encontradas."
    break
  fi

  retries=$((retries - 1))
  if [ $((retries % 10)) -eq 0 ]; then
    echo "  Esperando tablas sym_* ($TABLE_COUNT/4, $retries restantes)"
  fi
  sleep 5
done

if [ "$TABLE_COUNT" != "4" ] 2>/dev/null; then
  echo "[error] Bootstrap no completo despues de 10 minutos."
  exit 1
fi

# Esperar a que el motor se estabilice
sleep 15

# -------------------------------------------------------------------
# 3d. Aplicar configuracion SQL
# -------------------------------------------------------------------
echo "  Aplicando configuracion de replicacion..."
$MYSQL_CMD "$MYSQL_DB" < $CONFIG_SQL
echo "  Configuracion SQL aplicada."

# Esperar procesamiento
sleep 10

# -------------------------------------------------------------------
# 3e. Sincronizar triggers
# -------------------------------------------------------------------
echo "  Sincronizando triggers..."
$SYM_HOME/bin/symadmin --engine mysql-master sync-triggers

# -------------------------------------------------------------------
# 3f. Abrir registro para el nodo replica
# -------------------------------------------------------------------
echo "  Abriendo registro para nodo replica-001..."
$SYM_HOME/bin/symadmin --engine mysql-master open-registration replica replica-001

# Verificar que el registro se abrio
retries=15
REG_READY="0"
while [ $retries -gt 0 ]; do
  REG_READY=$(
    $MYSQL_CMD "$MYSQL_DB" -N -e "
      SELECT COUNT(*)
      FROM sym_node_security
      WHERE node_id='replica-001'
        AND registration_enabled=1;
    " 2>/dev/null || echo "0"
  )
  if [ "$REG_READY" = "1" ] 2>/dev/null; then
    echo "  Registro abierto para replica-001 confirmado."
    break
  fi
  retries=$((retries - 1))
  sleep 2
done

if [ "$REG_READY" != "1" ] 2>/dev/null; then
  echo "  Reintentando open-registration..."
  $SYM_HOME/bin/symadmin --engine mysql-master open-registration replica replica-001
  sleep 5
fi

# -------------------------------------------------------------------
# 3g. DETENER SymmetricDS temporal
#     El hot-deploy de engines no es confiable, asi que matamos
#     el proceso y reiniciamos con AMBOS motores.
# -------------------------------------------------------------------
echo "  Deteniendo SymmetricDS temporal..."
kill $SYM_PID 2>/dev/null || true
wait $SYM_PID 2>/dev/null || true
echo "  SymmetricDS detenido."

# Dar tiempo para liberar puertos
sleep 5

# -------------------------------------------------------------------
# 3h. Restaurar postgres-replica.properties
# -------------------------------------------------------------------
if [ -f "$REPLICA_STAGED" ]; then
  mv "$REPLICA_STAGED" "$REPLICA_PROPS"
  echo "  postgres-replica.properties restaurado en engines/."
fi

# -------------------------------------------------------------------
# 5. REINICIAR SymmetricDS con AMBOS motores
#    Ahora mysql-master tiene la configuracion lista y el registro
#    abierto. postgres-replica arrancara, creara sus tablas sym_*
#    en PostgreSQL, se registrara, y recibira la carga inicial.
# -------------------------------------------------------------------
echo "[5/5] Reiniciando SymmetricDS con AMBOS motores..."
echo "==========================================="
echo "  Replicacion MySQL -> PostgreSQL activa"
echo "==========================================="

# exec reemplaza este proceso → Docker recibe senales correctamente
exec $SYM_HOME/bin/sym --port 31415
