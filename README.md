# proyectoFincas

Sistema de gestión de fincas rurales con soporte offline.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 20+ (solo para ejecución local sin Docker)

## Inicialización rápida (Docker)

Levantar todos los servicios (PostgreSQL, backend y los dos frontends):

```bash
docker compose up --build
```

Esto inicia:

| Servicio          | Puerto | URL                    |
|-------------------|--------|------------------------|
| Backend (API)     | 3000   | http://localhost:3000  |
| Frontend Admin    | 5173   | http://localhost:5173  |
| Frontend Offline  | 5175   | http://localhost:5175  |
| PostgreSQL        | 5432   | localhost:5432         |

Los scripts SQL de inicialización (`init.sql` y `seed.sql`) se ejecutan automáticamente la primera vez que se levanta la base de datos.

> **Nota:** La primera vez puede tardar unos segundos mientras se descargan las imágenes y se construyen los contenedores.

## Ejecución manual (sin Docker)

### 1. Base de datos

Necesitas una instancia de PostgreSQL 16 corriendo. Puedes crearla con Docker:

```bash
docker run -d --name fincas-postgres \
  -e POSTGRES_DB=fincas_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
```

Luego ejecutar los scripts de inicialización:

```bash
docker exec -i fincas-postgres psql -U postgres -d fincas_db < database/init.sql
docker exec -i fincas-postgres psql -U postgres -d fincas_db < database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run dev   # Con nodemon (hot reload)
# o
npm start     # Modo producción
```

### 3. Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev
```

### 4. Frontend Offline

```bash
cd frontend-offline
npm install
npm run dev
```

## Variables de entorno

Copia el archivo de ejemplo y ajústalo según tu configuración local:

```bash
cp .env.example backend/.env
```

Variables disponibles en `backend/.env`:

| Variable       | Descripción                | Valor por defecto |
|----------------|----------------------------|--------------------|
| `PORT`         | Puerto del backend         | `3000`             |
| `DB_HOST`      | Host de PostgreSQL         | `postgres` / `localhost` |
| `DB_PORT`      | Puerto de PostgreSQL       | `5432`             |
| `DB_NAME`      | Nombre de la base de datos | `fincas_db`        |
| `DB_USER`      | Usuario de PostgreSQL      | `postgres`         |
| `DB_PASSWORD`  | Contraseña de PostgreSQL   | `postgres`         |

## Detener servicios (Docker)

```bash
docker compose down
```

Para eliminar también los datos de la base de datos:

```bash
docker compose down -v