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
  echo "[1/7] Esperando MySQL..."
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
  echo "[2/7] Esperando PostgreSQL replica..."
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
# FASE 1: Iniciar SymmetricDS SOLO con el motor mysql-master
# Movemos postgres-replica.properties fuera de engines/ para que
# SymmetricDS NO intente arrancarlo prematuramente.
# -------------------------------------------------------------------
echo "[3/7] Preparando arranque Fase 1 (solo mysql-master)..."

if [ -f "$REPLICA_PROPS" ]; then
  mv "$REPLICA_PROPS" "$REPLICA_STAGED"
  echo "  postgres-replica.properties movido a staging."
fi

echo "[4/7] Iniciando SymmetricDS (solo motor mysql-master)..."

$SYM_HOME/bin/sym \
  --port 31415 &

SYM_PID=$!

# -------------------------------------------------------------------
# 4. Esperar bootstrap completo de SymmetricDS
#    Verificamos que las tablas sym_* criticas existan en MySQL
# -------------------------------------------------------------------
echo "[5/7] Esperando bootstrap de SymmetricDS en MySQL..."

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
  echo "  Esperando tablas sym_* ($TABLE_COUNT/4 encontradas, $retries restantes)"
  sleep 5
done

if [ "$TABLE_COUNT" != "4" ] 2>/dev/null; then
  echo "[error] Bootstrap no completo despues de 10 minutos."
  exit 1
fi

# -------------------------------------------------------------------
# 5. Esperar a que SymmetricDS HTTP este escuchando
#    Esto es CRITICO: el nodo replica necesita conectarse via HTTP
# -------------------------------------------------------------------
echo "  Esperando que el servidor HTTP de SymmetricDS responda..."
retries=60
while [ $retries -gt 0 ]; do
  if wget -q -O /dev/null http://localhost:31415/sync/mysql-master 2>/dev/null || \
     curl -sf http://localhost:31415/sync/mysql-master > /dev/null 2>&1; then
    echo "  Servidor HTTP de SymmetricDS activo en puerto 31415."
    break
  fi
  retries=$((retries - 1))
  sleep 3
done

if [ $retries -eq 0 ]; then
  echo "[warning] No se pudo verificar HTTP, continuando de todas formas..."
fi

# Dar tiempo extra para estabilizacion del motor master
echo "  Estabilizando motor master (15s)..."
sleep 15

# -------------------------------------------------------------------
# 6. Aplicar configuracion y preparar replica
# -------------------------------------------------------------------
CONFIGURED=$(
  $MYSQL_CMD "$MYSQL_DB" -N -e "
    SELECT COUNT(*)
    FROM sym_trigger
    WHERE trigger_id='trigger_user';
  " 2>/dev/null || echo "0"
)

if [ "$CONFIGURED" = "0" ]; then
  echo "[6/7] Primera ejecucion - aplicando configuracion inicial..."

  # 6a. Insertar configuracion en tablas sym_*
  $MYSQL_CMD "$MYSQL_DB" < $CONFIG_SQL

  if [ $? -ne 0 ]; then
    echo "[error] Fallo al aplicar configuracion."
    exit 1
  fi
  echo "  Configuracion SQL aplicada."

  # 6b. Esperar procesamiento
  echo "  Esperando procesamiento de configuracion (15s)..."
  sleep 15

  # 6c. Sincronizar triggers en MySQL
  echo "  Sincronizando triggers..."
  $SYM_HOME/bin/symadmin \
    --engine mysql-master \
    sync-triggers

  # 6d. Abrir registro para el nodo replica (fallback si auto.registration falla)
  echo "  Abriendo registro para nodo replica-001..."
  $SYM_HOME/bin/symadmin \
    --engine mysql-master \
    open-registration replica replica-001

  # 6e. Verificar que el registro esta abierto antes de arrancar el replica
  echo "  Verificando registro abierto en sym_node_security..."
  retries=20
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
      echo "  CONFIRMADO: Registro abierto para replica-001."
      break
    fi
    retries=$((retries - 1))
    echo "  Esperando confirmacion de registro... ($retries restantes)"
    sleep 3
  done

  if [ "$REG_READY" != "1" ] 2>/dev/null; then
    echo "[warning] No se confirmo registro, reintentando open-registration..."
    $SYM_HOME/bin/symadmin \
      --engine mysql-master \
      open-registration replica replica-001
    sleep 10
  fi

  # -------------------------------------------------------------------
  # FASE 2: Restaurar postgres-replica.properties
  # El master esta configurado, los triggers estan listos, y el
  # registro esta abierto. Ahora es seguro arrancar el replica.
  # -------------------------------------------------------------------
  echo "  FASE 2: Iniciando motor postgres-replica..."
  if [ -f "$REPLICA_STAGED" ]; then
    mv "$REPLICA_STAGED" "$REPLICA_PROPS"
    echo "  postgres-replica.properties restaurado en engines/."
  fi

  # 6f. Esperar registro exitoso del replica (polling activo)
  echo "  Esperando que replica-001 complete su registro..."
  retries=90
  while [ $retries -gt 0 ]; do
    NODE_REGISTERED=$(
      $MYSQL_CMD "$MYSQL_DB" -N -e "
        SELECT COUNT(*)
        FROM sym_node
        WHERE node_id='replica-001';
      " 2>/dev/null || echo "0"
    )
    if [ "$NODE_REGISTERED" = "1" ] 2>/dev/null; then
      echo "  Nodo replica-001 registrado exitosamente!"
      break
    fi
    retries=$((retries - 1))
    if [ $((retries % 10)) -eq 0 ]; then
      echo "  Esperando registro de replica... ($retries restantes)"
    fi
    sleep 5
  done

  if [ "$NODE_REGISTERED" != "1" ] 2>/dev/null; then
    echo "[warning] El nodo replica no se registro en el tiempo esperado."
    echo "  auto.registration=true reintentara automaticamente."
    echo "  Si persiste: docker compose restart viator-symmetricds"
  else
    # 6g. Enviar carga inicial (auto.reload=true deberia hacerlo, esto es fallback)
    echo "  Enviando carga inicial (fallback)..."
    sleep 5
    $SYM_HOME/bin/symadmin \
      --engine mysql-master \
      reload-node replica-001 2>/dev/null || echo "  auto.reload ya envio la carga inicial."
  fi

else
  echo "[6/7] Configuracion ya existente, restaurando replica..."
  if [ -f "$REPLICA_STAGED" ]; then
    mv "$REPLICA_STAGED" "$REPLICA_PROPS"
    echo "  postgres-replica.properties restaurado."
  fi
fi

echo "[7/7] SymmetricDS listo y replicando."
echo "==========================================="
echo "  Replicacion MySQL -> PostgreSQL activa"
echo "==========================================="

# -------------------------------------------------------------------
# Mantener vivo el proceso
# -------------------------------------------------------------------
wait $SYM_PID
