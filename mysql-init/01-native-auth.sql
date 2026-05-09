-- =============================================================================
-- MySQL Init - Autenticación nativa y permisos para SymmetricDS
-- =============================================================================

-- Asegurar autenticación nativa para compatibilidad
ALTER USER 'root'@'%'
IDENTIFIED WITH mysql_native_password
BY 'viator_root_password';

ALTER USER 'viator_user'@'%'
IDENTIFIED WITH mysql_native_password
BY 'viator_password';

-- Otorgar permisos PROCESS necesarios para SymmetricDS
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
GRANT PROCESS ON *.* TO 'root'@'%';

FLUSH PRIVILEGES;