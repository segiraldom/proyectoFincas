# Dockerfile personalizado para PostgreSQL del Sistema de Fincas
# Basado en la imagen oficial de PostgreSQL 16

FROM postgres:16

# Etiquetas del mantenedor
LABEL maintainer="Sistema de Gestión de Fincas Rurales"
LABEL description="Base de datos PostgreSQL personalizada para el Sistema de Gestión de Fincas"
LABEL version="1.0.0"

# Variables de entorno por defecto (se pueden sobrescribir en docker-compose)
ENV POSTGRES_DB=fincas_db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copiar los scripts SQL al directorio de inicialización de PostgreSQL
# Los scripts en docker-entrypoint-initdb.d/ se ejecutan automáticamente
# en orden alfabético cuando el contenedor se crea por primera vez
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql

# Exponer el puerto por defecto de PostgreSQL
EXPOSE 5432