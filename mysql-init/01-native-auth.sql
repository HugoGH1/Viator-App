ALTER USER 'root'@'%' 
IDENTIFIED WITH mysql_native_password 
BY 'viator_root_password';

ALTER USER 'viator_user'@'%' 
IDENTIFIED WITH mysql_native_password 
BY 'viator_password';

FLUSH PRIVILEGES;