# =============================================================================
# SymmetricDS - Replicación MySQL → PostgreSQL
# =============================================================================
FROM jumpmind/symmetricds:3.15

USER root

# Instalar cliente MySQL
RUN apk add --no-cache mysql-client

# Copiar configuración
COPY engines/ /opt/symmetric-ds/engines/
COPY init/ /opt/symmetric-ds/init/

# Copiar entrypoint
COPY entrypoint.sh /opt/symmetric-ds/entrypoint.sh

RUN sed -i 's/\r$//' /opt/symmetric-ds/entrypoint.sh && \
    chmod +x /opt/symmetric-ds/entrypoint.sh

# Permisos
RUN chmod +x /opt/symmetric-ds/entrypoint.sh

EXPOSE 31415

ENTRYPOINT ["/opt/symmetric-ds/entrypoint.sh"]