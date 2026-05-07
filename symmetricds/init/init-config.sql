-- =============================================================================
-- SymmetricDS: Configuración de replicación MySQL → PostgreSQL
-- Replicación unidireccional (one-way push)
--
-- Este SQL se ejecuta contra MySQL (nodo maestro) la primera vez
-- que SymmetricDS arranca. Configura la topología de replicación.
-- =============================================================================

-- 1. Definir grupos de nodos
INSERT IGNORE INTO sym_node_group (node_group_id, description)
VALUES ('master', 'MySQL Primary - Source of truth');

INSERT IGNORE INTO sym_node_group (node_group_id, description)
VALUES ('replica', 'PostgreSQL Read Replica');

-- 2. Definir enlace unidireccional: master PUSH → replica
INSERT IGNORE INTO sym_node_group_link
  (source_node_group_id, target_node_group_id, data_event_action)
VALUES ('master', 'replica', 'P');

-- 3. Definir canal de sincronización para las tablas de Viator
INSERT IGNORE INTO sym_channel
  (channel_id, processing_order, max_batch_size, max_batch_to_send,
   contains_big_lob, enabled, description)
VALUES
  ('viator_channel', 1, 5000, 10, 1, 1, 'Canal principal de replicación Viator');

-- 4. Triggers para capturar cambios en cada tabla de la aplicación
--    sync_on_insert = 1, sync_on_update = 1, sync_on_delete = 1
INSERT IGNORE INTO sym_trigger
  (trigger_id, source_table_name, channel_id,
   sync_on_insert, sync_on_update, sync_on_delete,
   last_update_time, create_time)
VALUES
  ('trigger_user', 'User', 'viator_channel',
   1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT IGNORE INTO sym_trigger
  (trigger_id, source_table_name, channel_id,
   sync_on_insert, sync_on_update, sync_on_delete,
   last_update_time, create_time)
VALUES
  ('trigger_session', 'Session', 'viator_channel',
   1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Router: envía TODOS los datos del master al replica (tipo default)
INSERT IGNORE INTO sym_router
  (router_id, source_node_group_id, target_node_group_id, router_type,
   last_update_time, create_time)
VALUES
  ('master_to_replica', 'master', 'replica', 'default',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Enlazar cada trigger con el router
INSERT IGNORE INTO sym_trigger_router
  (trigger_id, router_id,
   last_update_time, create_time)
VALUES
  ('trigger_user', 'master_to_replica',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT IGNORE INTO sym_trigger_router
  (trigger_id, router_id,
   last_update_time, create_time)
VALUES
  ('trigger_session', 'master_to_replica',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
