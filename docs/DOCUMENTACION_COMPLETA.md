# 📋 Documentación Completa - Sistema de Gestión de Fincas Rurales

## Tabla de Contenidos
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Base de Datos](#base-de-datos)
6. [Backend](#backend)
7. [Frontend Admin](#frontend-admin)
8. [Frontend Offline](#frontend-offline)
9. [Mobile App](#mobile-app)
10. [Docker y Contenedores](#docker-y-contenedores)
11. [API Endpoints](#api-endpoints)
12. [Flujos de Trabajo](#flujos-de-trabajo)
13. [Diagramas](#diagramas)

---

## Descripción del Proyecto

### Propósito
El **Sistema de Gestión de Fincas Rurales** es una plataforma integral diseñada para administrar y monitorear fincas rurales, sus propietarios, actividades productivas y estadísticas. El sistema permite la gestión completa del ciclo de vida de las fincas, desde el registro de propietarios hasta el seguimiento de actividades agrícolas.

### Características Principales
- ✅ **Gestión de Propietarios**: Registro y administración de dueños de fincas
- ✅ **Administración de Fincas**: CRUD completo de propiedades rurales con ubicación geográfica
- ✅ **Seguimiento de Actividades**: Registro de actividades productivas por finca
- ✅ **Estadísticas en Tiempo Real**: Dashboard con métricas del sistema
- ✅ **Sincronización Offline**: Capacidad de trabajar sin conexión a internet
- ✅ **Multiplataforma**: Web admin, web offline y aplicación móvil
- ✅ **Relación Muchos-a-Muchos**: Una finca puede tener múltiples propietarios y viceversa

### Casos de Uso
1. **Administradores**: Gestión completa del sistema desde el panel administrativo
2. **Propietarios**: Visualización y gestión de sus propiedades
3. **Trabajadores de Campo**: Registro de actividades incluso sin conexión
4. **Analistas**: Consulta de estadísticas y reportes

---

## Arquitectura del Sistema

### Arquitectura General
El sistema sigue una **arquitectura cliente-servidor** con las siguientes capas:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTES (Frontend)                       │
├─────────────┬──────────────┬──────────────┬─────────────────┤
│   Admin Web │  Offline Web │  Mobile App  │  Mobile Offline │
│   (React)   │  (React+SQL) │  (Flutter)   │   (Flutter)     │
└──────┬──────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │             │              │                │
       │   Online    │   Offline    │   Online       │  Offline
       │             │              │                │
       └─────────────┴──────────────┴────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API REST (Backend)                        │
│                   Node.js + Express                          │
│                    Puerto: 3000                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Base de Datos (PostgreSQL)                   │
│                    Puerto: 5432                              │
│                  Base de datos: fincas_db                    │
└─────────────────────────────────────────────────────────────┘
```

### Patrón de Diseño
- **Backend**: MVC (Model-View-Controller) con Sequelize ORM
- **Frontend**: Componentes React con hooks
- **Comunicación**: REST API con JSON

### Flujo de Datos
1. **Online**: Cliente → API REST → PostgreSQL → Respuesta
2. **Offline**: Cliente → SQLite Local → Sincronización cuando hay conexión

---

## Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 20.x | Entorno de ejecución JavaScript |
| Express | 4.19.2 | Framework web para API REST |
| Sequelize | 6.37.3 | ORM para PostgreSQL |
| PostgreSQL | 16 | Base de datos relacional |
| CORS | 2.8.5 | Middleware para peticiones cruzadas |
| dotenv | 16.4.5 | Gestión de variables de entorno |
| pg | 8.11.5 | Driver de PostgreSQL para Node.js |

### Frontend Admin
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.6 | Librería de interfaz de usuario |
| Vite | 8.0.12 | Build tool y dev server |
| Leaflet | 1.9.4 | Librería de mapas interactivos |
| React Leaflet | 5.0.0 | Componentes React para Leaflet |

### Frontend Offline
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.0.0 | Librería de interfaz de usuario |
| Vite | 6.0.0 | Build tool y dev server |
| SQL.js | 1.11.0 | SQLite compilado a WebAssembly |

### DevOps
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Docker | Latest | Contenedorización |
| Docker Compose | 3.9 | Orquestación de contenedores |

---

## Estructura del Proyecto

```
proyectoFincas/
├── 📁 backend/                    # Servidor API REST
│   ├── 📁 src/
│   │   ├── 📄 app.js             # Configuración principal de Express
│   │   ├── 📄 server.js          # Punto de entrada del servidor
│   │   ├── 📁 config/
│   │   │   └── 📄 database.js    # Configuración de Sequelize
│   │   ├── 📁 models/            # Modelos de datos (Sequelize)
│   │   │   ├── 📄 index.js       # Exportación de modelos y relaciones
│   │   │   ├── 📄 fincaModel.js
│   │   │   ├── 📄 actividadModel.js
│   │   │   ├── 📄 propietarioModel.js
│   │   │   └── 📄 fincaPropietarioModel.js
│   │   ├── 📁 controllers/       # Lógica de negocio
│   │   │   ├── 📄 fincaController.js
│   │   │   ├── 📄 actividadController.js
│   │   │   ├── 📄 propietarioController.js
│   │   │   ├── 📄 estadisticaController.js
│   │   │   ├── 📄 fincaPropietarioController.js
│   │   │   └── 📄 syncController.js
│   │   ├── 📁 routes/            # Definición de endpoints
│   │   │   ├── 📄 fincaRoutes.js
│   │   │   ├── 📄 actividadRoutes.js
│   │   │   ├── 📄 propietarioRoutes.js
│   │   │   ├── 📄 estadisticaRoutes.js
│   │   │   └── 📄 syncRoutes.js
│   │   ├── 📁 middlewares/
│   │   │   └── 📄 errorHandler.js # Manejo de errores
│   │   ├── 📁 services/
│   │   │   └── 📄 syncService.js # Lógica de sincronización
│   │   └── 📁 database/
│   │       └── 📄 connection.js  # Conexión directa a BD
│   ├── 📄 Dockerfile             # Configuración Docker backend
│   ├── 📄 package.json           # Dependencias y scripts
│   ├── 📄 .env                   # Variables de entorno
│   └── 📄 .dockerignore          # Archivos ignorados por Docker
│
├── 📁 frontend-admin/            # Panel administrativo web
│   ├── 📁 src/
│   │   ├── 📄 App.jsx           # Componente principal
│   │   ├── 📄 main.jsx          # Punto de entrada
│   │   ├── 📄 index.css         # Estilos globales
│   │   ├── 📄 App.css           # Estilos del App
│   │   └── 📁 assets/           # Recursos estáticos
│   ├── 📄 index.html            # HTML base
│   ├── 📄 vite.config.js        # Configuración de Vite
│   ├── 📄 Dockerfile            # Configuración Docker frontend
│   ├── 📄 package.json          # Dependencias y scripts
│   └── 📄 .dockerignore         # Archivos ignorados
│
├── 📁 frontend-offline/          # Frontend web offline
│   ├── 📁 src/
│   │   ├── 📄 App.jsx           # Componente principal
│   │   ├── 📄 main.jsx          # Punto de entrada
│   │   ├── 📄 database.js       # Configuración SQLite
│   │   ├── 📄 sync.js           # Lógica de sincronización
│   │   ├── 📄 index.css         # Estilos globales
│   │   └── 📄 App.css           # Estilos del App
│   ├── 📁 public/
│   │   └── 📄 sql-wasm-browser.wasm  # SQLite WebAssembly
│   ├── 📄 index.html            # HTML base
│   ├── 📄 vite.config.js        # Configuración de Vite
│   ├── 📄 Dockerfile            # Configuración Docker
│   ├── 📄 package.json          # Dependencias y scripts
│   └── 📄 .dockerignore         # Archivos ignorados
│
├── 📁 database/                 # Scripts de base de datos
│   └── 📄 init.sql              # Script de inicialización
│
├── 📁 docs/                     # Documentación
│   └── 📄 DOCUMENTACION_COMPLETA.md
│
├── 📄 docker-compose.yml        # Orquestación Docker
├── 📄 .env.example              # Ejemplo de variables de entorno
├── 📄 .gitignore                # Archivos ignorados por Git
└── 📄 README.md                 # README principal
```

---

## Base de Datos

### Motor de Base de Datos
- **PostgreSQL 16** - Sistema de gestión de bases de datos relacional
- **Ubicación**: Contenedor Docker `fincas_postgres`
- **Puerto**: 5432
- **Base de datos**: `fincas_db`
- **Usuario**: `postgres`
- **Contraseña**: `postgres`

### Esquema de Base de Datos

#### 1. Tabla: `propietarios`
Almacena la información de los dueños de las fincas.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| `nombre` | VARCHAR(150) | NOT NULL | Nombre completo del propietario |
| `documento` | VARCHAR(50) | UNIQUE, NOT NULL | Documento de identidad |
| `telefono` | VARCHAR(30) | - | Número telefónico |
| `correo` | VARCHAR(100) | - | Correo electrónico |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Índices**: `idx_propietarios_documento` en columna `documento`

#### 2. Tabla: `fincas`
Almacena la información de las propiedades rurales.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| `nombre` | VARCHAR(150) | NOT NULL | Nombre de la finca |
| `departamento` | VARCHAR(100) | NOT NULL | Departamento donde se ubica |
| `municipio` | VARCHAR(100) | NOT NULL | Municipio donde se ubica |
| `area_total_hectareas` | DECIMAL(10,2) | - | Área total en hectáreas |
| `latitud` | DECIMAL(10,8) | - | Coordenada latitud |
| `longitud` | DECIMAL(11,8) | - | Coordenada longitud |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Índices**: `idx_fincas_departamento` en columna `departamento`

#### 3. Tabla: `finca_propietario`
Tabla intermedia para relación muchos-a-muchos entre fincas y propietarios.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `finca_id` | UUID | FOREIGN KEY, PRIMARY KEY | Referencia a fincas.id |
| `propietario_id` | UUID | FOREIGN KEY, PRIMARY KEY | Referencia a propietarios.id |

**Relaciones**:
- `fk_finca`: FOREIGN KEY (finca_id) REFERENCES fincas(id) ON DELETE CASCADE
- `fk_propietario`: FOREIGN KEY (propietario_id) REFERENCES propietarios(id) ON DELETE CASCADE

#### 4. Tabla: `actividades`
Registra las actividades productivas realizadas en las fincas.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| `finca_id` | UUID | FOREIGN KEY, NOT NULL | Referencia a fincas.id |
| `tipo` | VARCHAR(100) | NOT NULL | Tipo de actividad (ej: cultivo, ganadería) |
| `descripcion` | TEXT | - | Descripción detallada |
| `cantidad` | DECIMAL(10,2) | - | Cantidad producida o utilizada |
| `unidad` | VARCHAR(50) | - | Unidad de medida (ej: kg, litros) |
| `produccion` | DECIMAL(10,2) | - | Cantidad producida |
| `unidad_produccion` | VARCHAR(50) | - | Unidad de producción |
| `area_hectareas` | DECIMAL(10,2) | - | Área utilizada en hectáreas |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |

**Relaciones**:
- `fk_finca_actividad`: FOREIGN KEY (finca_id) REFERENCES fincas(id) ON DELETE CASCADE

**Índices**: `idx_actividades_tipo` en columna `tipo`

### Extensiones de PostgreSQL
- **pgcrypto**: Proporciona funciones criptográficas y de generación de UUID

### Diagrama Entidad-Relación

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│  PROPIETARIOS   │       │  FINCA_PROPIETARIO   │       │     FINCAS      │
├─────────────────┤       ├──────────────────────┤       ├─────────────────┤
│ id (UUID) PK    │◄──────│ propietario_id (FK)  │       │ id (UUID) PK    │
│ nombre          │       │ finca_id (FK)        │──────►│ nombre          │
│ documento       │       └──────────────────────┘       │ departamento    │
│ telefono        │                                      │ municipio       │
│ correo          │                                      │ area_total      │
│ fecha_registro  │                                      │ latitud         │
└─────────────────┘                                      │ longitud        │
        ▲                                                │ fecha_registro  │
        │                                                └─────────────────┘
        │                                                        │
        │                                                        │
        │                                                        ▼
        │                                                ┌─────────────────┐
        └────────────────────────────────────────────────│   ACTIVIDADES   │
                                                         ├─────────────────┤
                                                         │ id (UUID) PK    │
                                                         │ finca_id (FK)   │
                                                         │ tipo            │
                                                         │ descripcion     │
                                                         │ cantidad        │
                                                         │ unidad          │
                                                         │ produccion      │
                                                         │ unidad_prod     │
                                                         │ area_has        │
                                                         │ fecha_registro  │
                                                         └─────────────────┘
```

---

## Backend

### Descripción
El backend es una API REST construida con **Node.js + Express** que gestiona todas las operaciones del sistema. Utiliza **Sequelize** como ORM para interactuar con PostgreSQL.

### Archivos Principales

#### `src/server.js` - Punto de Entrada
**Propósito**: Inicializar el servidor y establecer conexión a la base de datos.

**Funcionalidad**:
1. Importa la configuración de Express desde `app.js`
2. Importa la configuración de Sequelize desde `database.js`
3. Importa los modelos para establecer relaciones
4. Autentica la conexión a PostgreSQL
5. Sincroniza modelos con la base de datos (sin alterar estructura)
6. Inicia el servidor en el puerto especificado (default: 3000)

**Código clave**:
```javascript
await sequelize.authenticate();      // Verifica conexión
await sequelize.sync({ alter: false }); // Sincroniza modelos
app.listen(PORT, () => { ... });     // Inicia servidor
```

#### `src/app.js` - Configuración de Express
**Propósito**: Configurar middleware y rutas de la aplicación.

**Funcionalidad**:
1. Habilita CORS para permitir peticiones desde cualquier origen
2. Configura parser de JSON
3. Define rutas para cada recurso:
   - `/api/fincas` - Gestión de fincas
   - `/api/propietarios` - Gestión de propietarios
   - `/api/actividades` - Gestión de actividades
   - `/api/estadisticas` - Consulta de estadísticas
   - `/api/sync` - Sincronización offline
4. Configura manejadores de errores

#### `src/config/database.js` - Configuración de Sequelize
**Propósito**: Establecer conexión con PostgreSQL.

**Configuración**:
- **Host**: Variable de entorno `DB_HOST` (default: localhost)
- **Puerto**: Variable de entorno `DB_PORT` (default: 5432)
- **Base de datos**: Variable de entorno `DB_NAME` (default: fincas_db)
- **Usuario**: Variable de entorno `DB_USER` (default: postgres)
- **Contraseña**: Variable de entorno `DB_PASSWORD` (default: postgres)
- **Dialecto**: PostgreSQL
- **Logging**: Desactivado

### Modelos (Sequelize)

#### `models/fincaModel.js`
Define el modelo `Finca` que mapea a la tabla `fincas`.

**Atributos**:
- `id`: UUID, primaryKey, defaultValue (UUID v4)
- `nombre`: STRING(150), allowNull: false
- `departamento`: STRING(100), allowNull: false
- `municipio`: STRING(100), allowNull: false
- `area_total_hectareas`: DECIMAL(10,2)
- `latitud`: DECIMAL(10,8)
- `longitud`: DECIMAL(11,8)
- `fecha_registro`: DATE, defaultValue: NOW()

#### `models/actividadModel.js`
Define el modelo `Actividad` que mapea a la tabla `actividades`.

**Atributos**:
- `id`: UUID, primaryKey, defaultValue (UUID v4)
- `finca_id`: UUID, allowNull: false, references: fincas
- `tipo`: STRING(100), allowNull: false
- `descripcion`: TEXT
- `cantidad`: DECIMAL(10,2)
- `unidad`: STRING(50)
- `produccion`: DECIMAL(10,2)
- `unidad_produccion`: STRING(50)
- `area_hectareas`: DECIMAL(10,2)
- `fecha_registro`: DATE, defaultValue: NOW()

#### `models/propietarioModel.js`
Define el modelo `Propietario` que mapea a la tabla `propietarios`.

**Atributos**:
- `id`: UUID, primaryKey, defaultValue (UUID v4)
- `nombre`: STRING(150), allowNull: false
- `documento`: STRING(50), unique, allowNull: false
- `telefono`: STRING(30)
- `correo`: STRING(100)
- `fecha_registro`: DATE, defaultValue: NOW()

#### `models/fincaPropietarioModel.js`
Define el modelo `FincaPropietario` para la tabla intermedia.

**Atributos**:
- `finca_id`: UUID, primaryKey, references: fincas
- `propietario_id`: UUID, primaryKey, references: propietarios

#### `models/index.js` - Relaciones
Establece las relaciones entre modelos:

```javascript
// Una finca tiene muchas actividades
Finca.hasMany(Actividad, { foreignKey: 'finca_id', as: 'actividades' });
Actividad.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

// Relación muchos-a-muchos entre fincas y propietarios
Finca.belongsToMany(Propietario, { 
  through: FincaPropietario,
  foreignKey: 'finca_id',
  otherKey: 'propietario_id',
  as: 'propietarios'
});

Propietario.belongsToMany(Finca, {
  through: FincaPropietario,
  foreignKey: 'propietario_id',
  otherKey: 'finca_id',
  as: 'fincas'
});
```

### Controladores

#### `controllers/fincaController.js`
Gestiona operaciones CRUD para fincas.

**Funciones**:
- `getAllFincas`: Obtiene todas las fincas con sus actividades y propietarios
- `getFincaById`: Obtiene una finca específica por ID
- `createFinca`: Crea una nueva finca y asigna propietarios
- `updateFinca`: Actualiza datos de una finca
- `deleteFinca`: Elimina una finca (cascada elimina actividades y relaciones)

**Inclusiones**: Las consultas incluyen automáticamente actividades y propietarios relacionados.

#### `controllers/actividadController.js`
Gestiona operaciones CRUD para actividades.

**Funciones**:
- `getAllActividades`: Obtiene todas las actividades con su finca asociada
- `getActividadById`: Obtiene una actividad específica
- `createActividad`: Crea una nueva actividad (valida existencia de finca)
- `updateActividad`: Actualiza datos de una actividad
- `deleteActividad`: Elimina una actividad

#### `controllers/propietarioController.js`
Gestiona operaciones CRUD para propietarios.

**Funciones**:
- `getAllPropietarios`: Obtiene todos los propietarios con sus fincas
- `getPropietarioById`: Obtiene un propietario específico
- `createPropietario`: Crea un nuevo propietario
- `updatePropietario`: Actualiza datos de un propietario
- `deletePropietario`: Elimina un propietario

#### `controllers/estadisticaController.js`
Proporciona estadísticas del sistema.

**Funciones**:
- `getEstadisticas`: Retorna:
  - Total de fincas
  - Total de actividades
  - Total de propietarios
  - Suma total de hectáreas
  - Actividades agrupadas por tipo

#### `controllers/fincaPropietarioController.js`
Gestiona la relación entre fincas y propietarios.

**Funciones**:
- `crear`: Establece relación entre una finca y un propietario

#### `controllers/syncController.js`
Maneja operaciones de sincronización para clientes offline.

**Funciones**:
- Sincroniza datos desde clientes móviles/web offline
- Marca registros como sincronizados
- Resuelve conflictos de sincronización

### Rutas (Endpoints)

#### `routes/fincaRoutes.js`
```
GET    /api/fincas          - Listar todas las fincas
GET    /api/fincas/:id      - Obtener finca por ID
POST   /api/fincas          - Crear nueva finca
PUT    /api/fincas/:id      - Actualizar finca
DELETE /api/fincas/:id      - Eliminar finca
```

#### `routes/actividadRoutes.js`
```
GET    /api/actividades          - Listar todas las actividades
GET    /api/actividades/:id      - Obtener actividad por ID
POST   /api/actividades          - Crear nueva actividad
PUT    /api/actividades/:id      - Actualizar actividad
DELETE /api/actividades/:id      - Eliminar actividad
```

#### `routes/propietarioRoutes.js`
```
GET    /api/propietarios          - Listar todos los propietarios
GET    /api/propietarios/:id      - Obtener propietario por ID
POST   /api/propietarios          - Crear nuevo propietario
PUT    /api/propietarios/:id      - Actualizar propietario
DELETE /api/propietarios/:id      - Eliminar propietario
```

#### `routes/estadisticaRoutes.js`
```
GET    /api/estadisticas          - Obtener estadísticas del sistema
```

#### `routes/syncRoutes.js`
```
POST   /api/sync/propietarios     - Sincronizar propietarios
POST   /api/sync/fincas           - Sincronizar fincas
POST   /api/sync/actividades      - Sincronizar actividades
```

### Middlewares

#### `middlewares/errorHandler.js`
Maneja errores de manera centralizada.

**Funciones**:
- `notFoundHandler`: Retorna 404 para rutas no encontradas
- `errorHandler`: Maneja errores internos y retorna respuestas apropiadas

### Servicios

#### `services/syncService.js`
Contiene lógica de negocio para sincronización de datos offline-online.

---

## Frontend Admin

### Descripción
Panel administrativo web construido con **React + Vite** para la gestión completa del sistema. Incluye visualización de mapas con Leaflet.

### Archivos Principales

#### `src/App.jsx` - Componente Principal
**Propósito**: Configurar la estructura principal de la aplicación.

**Funcionalidad**:
- Define rutas de navegación
- Configura layout principal
- Integra componentes de administración

#### `src/main.jsx` - Punto de Entrada
**Propósito**: Renderizar la aplicación React en el DOM.

#### `vite.config.js` - Configuración de Vite
**Configuración**:
- Puerto: 5173
- Proxy para API: Redirige peticiones `/api` a `http://localhost:3000`
- Plugins: React plugin para JSX

### Dependencias Clave

| Dependencia | Propósito |
|-------------|-----------|
| `react` | Librería UI |
| `react-dom` | Renderizado en DOM |
| `leaflet` | Librería de mapas |
| `react-leaflet` | Componentes React para mapas |
| `vite` | Build tool y dev server |

### Características
- ✅ **Dashboard**: Vista general del systema
- ✅ **Gestión de Fincas**: CRUD completo con formulario
- ✅ **Mapas Interactivos**: Visualización de ubicación de fincas
- ✅ **Listado de Actividades**: Ver actividades por finca
- ✅ **Estadísticas**: Gráficos y métricas
- ✅ **Diseño Responsivo**: Adaptable a diferentes dispositivos

---

## Frontend Offline

### Descripción
Frontend web especializado que funciona **completamente offline** utilizando **SQL.js** (SQLite compilado a WebAssembly). Permite trabajar sin conexión y sincronizar cuando hay disponibilidad.

### Archivos Principales

#### `src/database.js` - Configuración SQLite
**Propósito**: Inicializar y gestionar base de datos SQLite en el navegador.

**Funcionalidad**:
1. Carga SQL.js (SQLite en WebAssembly)
2. Crea base de datos en memoria
3. Define esquema de tablas (propietarios, fincas, actividades)
4. Proporciona funciones CRUD para operaciones locales

**Estructura de Tablas Locales**:
- `propietarios`: Similar a PostgreSQL pero con campo `synced` (boolean)
- `fincas`: Similar a PostgreSQL pero con campo `synced` (boolean)
- `actividades`: Similar a PostgreSQL pero con campo `synced` (boolean)

#### `src/sync.js` - Lógica de Sincronización
**Propósito**: Sincronizar datos entre SQLite local y API REST.

**Funcionalidad**:
1. **Detección de Conexión**: Verifica disponibilidad de internet
2. **Sincronización Pendiente**: Envía registros locales no sincronizados
3. **Actualización Local**: Recibe cambios desde el servidor
4. **Resolución de Conflictos**: Maneja discrepancias entre local y servidor

**Flujo de Sincronización**:
```
1. Verificar conexión a internet
2. Obtener registros locales con synced = false
3. Para cada registro pendiente:
   - Enviar a API REST
   - Si éxito: marcar como synced = true
   - Si falla: mantener como pendiente
4. Descargar cambios del servidor
5. Actualizar base de datos local
```

#### `src/App.jsx` - Componente Principal
**Propósito**: Interfaz de usuario para trabajo offline.

**Características**:
- Interfaz similar al frontend admin
- Indicador de estado de conexión
- Botón manual de sincronización
- Notificaciones de sincronización

#### `public/sql-wasm-browser.wasm`
**Propósito**: Archivo WebAssembly de SQLite para ejecución en navegador.

### Dependencias Clave

| Dependencia | Propósito |
|-------------|-----------|
| `react` | Librería UI |
| `sql.js` | SQLite en WebAssembly |
| `vite-plugin-static-copy` | Copiar archivos estáticos (wasm) |

### Características
- ✅ **Trabajo Offline Completo**: Todas las operaciones CRUD sin internet
- ✅ **Base de Datos Local**: SQLite en el navegador
- ✅ **Sincronización Automática**: Cuando detecta conexión
- ✅ **Indicador de Estado**: Muestra conexión online/offline
- ✅ **Cola de Sincronización**: Maneja operaciones pendientes

---

## Docker y Contenedores

### Descripción
El proyecto utiliza **Docker Compose** para orquestar todos los servicios en contenedores separados, facilitando el despliegue y la consistencia entre entornos.

### `docker-compose.yml`

#### Servicio: `postgres`
**Configuración**:
```yaml
image: postgres:16
container_name: fincas_postgres
restart: always
ports:
  - "5432:5432"
environment:
  POSTGRES_DB: fincas_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
volumes:
  - postgres_data:/var/lib/postgresql/data
  - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
```

**Propósito**: Base de datos PostgreSQL
- **Imagen**: PostgreSQL 16 oficial
- **Puerto**: 5432 (expuesto al host)
- **Volumen Persistente**: `postgres_data` para mantener datos
- **Inicialización**: Ejecuta `init.sql` al crear el contenedor

#### Servicio: `backend`
**Configuración**:
```yaml
build:
  context: ./backend
container_name: fincas_backend
restart: always
ports:
  - "3000:3000"
environment:
  PORT: 3000
  DB_HOST: postgres
  DB_PORT: 5432
  DB_NAME: fincas_db
  DB_USER: postgres
  DB_PASSWORD: postgres
depends_on:
  - postgres
```

**Propósito**: API REST Node.js
- **Build**: Desde `./backend/Dockerfile`
- **Puerto**: 3000 (expuesto al host)
- **Variables de Entorno**: Configuración de conexión a BD
- **Dependencia**: Espera a que PostgreSQL esté disponible

#### Servicio: `frontend-admin`
**Configuración**:
```yaml
build:
  context: ./frontend-admin
container_name: fincas_frontend_admin
restart: always
ports:
  - "5173:5173"
environment:
  VITE_API_URL: http://localhost:3000
depends_on:
  - backend
```

**Propósito**: Panel administrativo React
- **Build**: Desde `./frontend-admin/Dockerfile`
- **Puerto**: 5173 (expuesto al host)
- **Variable de Entorno**: URL de la API
- **Dependencia**: Espera a que backend esté disponible

#### Servicio: `frontend-offline`
**Configuración**:
```yaml
build:
  context: ./frontend-offline
container_name: fincas_frontend_offline
restart: always
ports:
  - "5175:5175"
depends_on:
  - backend
environment:
  VITE_API_URL: http://localhost:3000
```

**Propósito**: Frontend web offline React + SQL.js
- **Build**: Desde `./frontend-offline/Dockerfile`
- **Puerto**: 5175 (expuesto al host)
- **Variable de Entorno**: URL de la API

### Volúmenes

#### `postgres_data`
**Propósito**: Almacenamiento persistente para PostgreSQL
- **Tipo**: Volumen nombrado de Docker
- **Ubicación**: `/var/lib/postgresql/data` dentro del contenedor
- **Persistencia**: Los datos sobreviven a reinicios del contenedor

### Red Docker
**Tipo**: Red bridge por defecto
**Comunicación**:
- Los contenedores se comunican por nombre de servicio (ej: `postgres`)
- El host accede mediante puertos expuestos

### Comandos Útiles

```bash
# Iniciar todos los servicios
docker compose up -d

# Detener todos los servicios
docker compose down

# Ver logs de un servicio
docker compose logs backend

# Reiniciar un servicio
docker compose restart backend

# Ver estado de servicios
docker compose ps

# Ejecutar comando en contenedor
docker compose exec backend npm run dev

# Reconstruir contenedores
docker compose up -d --build

# Eliminar volúmenes (¡cuidado! pierde datos)
docker compose down -v
```

### Dockerfiles

#### `backend/Dockerfile`
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Explicación**:
1. Usa imagen oficial Node.js 20
2. Establece directorio de trabajo `/app`
3. Copia archivos de dependencias
4. Instala dependencias npm
5. Copia todo el código
6. Expone puerto 3000
7. Comando de inicio: `npm start`

#### `frontend-admin/Dockerfile`
```dockerfile
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Explicación**:
1. **Build Stage**: Compila la app React con Vite
2. **Production Stage**: Usa Nginx para servir archivos estáticos
3. Copia build desde etapa anterior
4. Configura Nginx
5. Expone puerto 80
6. Inicia Nginx en foreground

#### `frontend-offline/Dockerfile`
Similar al frontend-admin pero para la versión offline.

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Fincas

#### Listar todas las fincas
```
GET /api/fincas
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": "uuid",
    "nombre": "Finca El Roble",
    "departamento": "Cundinamarca",
    "municipio": "Chía",
    "area_total_hectareas": 50.5,
    "latitud": 4.9167,
    "longitud": -74.0833,
    "fecha_registro": "2024-01-15T10:30:00.000Z",
    "actividades": [...],
    "propietarios": [...]
  }
]
```

#### Obtener finca por ID
```
GET /api/fincas/:id
```

**Respuesta Exitosa** (200):
```json
{
  "id": "uuid",
  "nombre": "Finca El Roble",
  "departamento": "Cundinamarca",
  "municipio": "Chía",
  "area_total_hectareas": 50.5,
  "latitud": 4.9167,
  "longitud": -74.0833,
  "fecha_registro": "2024-01-15T10:30:00.000Z",
  "actividades": [...],
  "propietarios": [...]
}
```

#### Crear nueva finca
```
POST /api/fincas
Content-Type: application/json

{
  "nombre": "Finca La Esperanza",
  "departamento": "Antioquia",
  "municipio": "Medellín",
  "area_total_hectareas": 25.0,
  "latitud": 6.2442,
  "longitud": -75.5812,
  "propietarios": ["uuid-propietario-1", "uuid-propietario-2"]
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": "nuevo-uuid",
  "nombre": "Finca La Esperanza",
  "departamento": "Antioquia",
  "municipio": "Medellín",
  "area_total_hectareas": 25.0,
  "latitud": 6.2442,
  "longitud": -75.5812,
  "fecha_registro": "2024-01-20T14:20:00.000Z",
  "propietarios": [...]
}
```

#### Actualizar finca
```
PUT /api/fincas/:id
Content-Type: application/json

{
  "nombre": "Finca La Esperanza Actualizada",
  "area_total_hectareas": 30.0,
  "propietarios": ["uuid-propietario-1"]
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": "uuid",
  "nombre": "Finca La Esperanza Actualizada",
  "departamento": "Antioquia",
  "municipio": "Medellín",
  "area_total_hectareas": 30.0,
  "latitud": 6.2442,
  "longitud": -75.5812,
  "fecha_registro": "2024-01-20T14:20:00.000Z",
  "actividades": [...],
  "propietarios": [...]
}
```

#### Eliminar finca
```
DELETE /api/fincas/:id
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Finca eliminada correctamente"
}
```

### Actividades

#### Listar todas las actividades
```
GET /api/actividades
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": "uuid",
    "finca_id": "uuid-finca",
    "tipo": "Cultivo de maíz",
    "descripcion": "Siembra de maíz amarillo",
    "cantidad": 100,
    "unidad": "kg",
    "produccion": 500,
    "unidad_produccion": "kg",
    "area_hectareas": 5.0,
    "fecha_registro": "2024-01-15T10:30:00.000Z",
    "finca": {...}
  }
]
```

#### Obtener actividad por ID
```
GET /api/actividades/:id
```

#### Crear nueva actividad
```
POST /api/actividades
Content-Type: application/json

{
  "finca_id": "uuid-finca",
  "tipo": "Cultivo de frijol",
  "descripcion": "Siembra de frijol cargamanto",
  "cantidad": 50,
  "unidad": "kg",
  "produccion": 200,
  "unidad_produccion": "kg",
  "area_hectareas": 2.5
}
```

#### Actualizar actividad
```
PUT /api/actividades/:id
Content-Type: application/json

{
  "tipo": "Cultivo de frijol actualizado",
  "cantidad": 60
}
```

#### Eliminar actividad
```
DELETE /api/actividades/:id
```

### Propietarios

#### Listar todos los propietarios
```
GET /api/propietarios
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "documento": "123456789",
    "telefono": "+57 300 1234567",
    "correo": "juan@example.com",
    "fecha_registro": "2024-01-10T08:00:00.000Z",
    "fincas": [...]
  }
]
```

#### Obtener propietario por ID
```
GET /api/propietarios/:id
```

#### Crear nuevo propietario
```
POST /api/propietarios
Content-Type: application/json

{
  "nombre": "María González",
  "documento": "987654321",
  "telefono": "+57 300 7654321",
  "correo": "maria@example.com"
}
```

#### Actualizar propietario
```
PUT /api/propietarios/:id
Content-Type: application/json

{
  "nombre": "María González Actualizada",
  "telefono": "+57 310 7654321"
}
```

#### Eliminar propietario
```
DELETE /api/propietarios/:id
```

### Estadísticas

#### Obtener estadísticas del sistema
```
GET /api/estadisticas
```

**Respuesta Exitosa** (200):
```json
{
  "totalFincas": 15,
  "totalActividades": 42,
  "totalPropietarios": 8,
  "totalHectareas": 450.75,
  "actividadesPorTipo": [
    {
      "tipo": "Cultivo de maíz",
      "total": "12"
    },
    {
      "tipo": "Ganadería",
      "total": "8"
    },
    {
      "tipo": "Cultivo de frijol",
      "total": "5"
    }
  ]
}
```

### Sincronización

#### Sincronizar propietarios
```
POST /api/sync/propietarios
Content-Type: application/json

[
  {
    "id": "uuid-local",
    "nombre": "Carlos Rodríguez",
    "documento": "456789123",
    "telefono": "+57 320 4567890",
    "correo": "carlos@example.com",
    "synced": false
  }
]
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Sincronización completada",
  "sincronizados": 1,
  "fallidos": 0
}
```

#### Sincronizar fincas
```
POST /api/sync/fincas
```

#### Sincronizar actividades
```
POST /api/sync/actividades
```

### Códigos de Estado HTTP

| Código | Significado | Uso en esta API |
|--------|-------------|-----------------|
| 200 | OK | Operación exitosa (GET, PUT) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos o faltantes |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

---

## Flujos de Trabajo

### Flujo 1: Registro de Nueva Finca (Online)

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Cliente   │    │   Backend    │    │  PostgreSQL │    │  Respuesta   │
│  (Frontend) │    │   (API)      │    │   (BD)      │    │              │
└──────┬──────┘    └──────┬───────┘    └──────┬──────┘    └──────┬───────┘
       │                  │                   │                  │
       │  POST /fincas    │                   │                  │
       │  (datos finca)   │                   │                  │
       │─────────────────>│                   │                  │
       │                  │                   │                  │
       │                  │  INSERT INTO      │                  │
       │                  │  fincas (...)     │                  │
       │                  │──────────────────>│                  │
       │                  │                   │                  │
       │                  │                   │  ID generado     │
       │                  │<──────────────────│                  │
       │                  │                   │                  │
       │                  │  201 Created      │                  │
       │                  │  (finca + id)     │                  │
       │<─────────────────│                   │                  │
       │                  │                   │                  │
```

### Flujo 2: Sincronización Offline → Online

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Mobile App │    │ Sync Service │    │  Backend    │    │  PostgreSQL │
│  (Offline)  │    │  (Local)     │    │   (API)     │    │   (BD)      │
└──────┬──────┘    └──────┬───────┘    └──────┬──────┘    └──────┬───────┘
       │                  │                   │                  │
       │  1. Detectar     │                   │                  │
       │  conexión        │                   │                  │
       │  (WiFi/4G)       │                   │                  │
       │                  │                   │                  │
       │  2. Obtener      │                   │                  │
       │  pendientes      │                   │                  │
       │  (synced=false)  │                   │                  │
       │<─────────────────│                   │                  │
       │                  │                   │                  │
       │  3. Enviar       │                   │                  │
       │  pendientes      │                   │                  │
       │─────────────────────────────────────>│                  │
       │                  │                   │                  │
       │                  │                   │  INSERT/UPDATE   │
       │                  │                   │─────────────────>│
       │                  │                   │                  │
       │                  │                   │  200 OK          │
       │                  │<──────────────────│                  │
       │                  │                   │                  │
       │  4. Marcar como  │                   │                  │
       │  synced=true     │                   │                  │
       │─────────────────>│                   │                  │
       │                  │                   │                  │
```

### Flujo 3: Consulta con Relaciones

```
Usuario solicita: GET /api/fincas/123

1. Controller recibe petición
   └─> fincaController.getFincaById(req, res)

2. Modelo consulta con inclusiones:
   Finca.findByPk(123, {
     include: [
       { model: Actividad, as: 'actividades' },
       { model: Propietario, as: 'propietarios' }
     ]
   })

3. Sequelize genera SQL:
   SELECT * FROM fincas WHERE id = 123
   SELECT * FROM actividades WHERE finca_id = 123
   SELECT * FROM propietarios 
   INNER JOIN finca_propietario ON ...

4. Respuesta JSON combinada:
   {
     "id": "123",
     "nombre": "Finca El Roble",
     "actividades": [...],
     "propietarios": [...]
   }
```

---

## Diagramas

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                │
├───────────────┬───────────────┬───────────────┬─────────────────┤
│               │               │               │                 │
│  Frontend     │  Frontend     │  Mobile App   │  Mobile App     │
│  Admin        │  Offline      │  Online       │  Offline        │
│  (React)      │  (React+SQL)  │  (Flutter)    │  (Flutter)      │
│               │               │               │                 │
│  Puerto 5173  │  Puerto 5175  │  Android/iOS  │  Android/iOS    │
└───────┬───────┴───────┬───────┴───────┬───────┴────────┬────────┘
        │               │               │                │
        │   HTTP/REST   │   HTTP/REST   │   HTTP/REST    │
        │               │               │                │
        └───────────────┴───────────────┴────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API REST (Backend)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express Server                        │  │
│  │                   Puerto 3000                            │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │  Routes    │  │Controllers │  │  Models    │        │  │
│  │  │            │  │            │  │ (Sequelize)│        │  │
│  │  │ /fincas    │  │ finca      │  │ Finca      │        │  │
│  │  │ /actividad │  │ actividad  │  │ Actividad  │        │  │
│  │  │ /propie... │  │ propie...  │  │ Propie...  │        │  │
│  │  │ /estad...  │  │ estad...   │  │ Estad...   │        │  │
│  │  │ /sync      │  │ sync       │  │            │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │           Middlewares & Services                   │ │  │
│  │  │  • CORS           • errorHandler                   │ │  │
│  │  │  • JSON parser    • syncService                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐    │
│  │  propietarios│  │finca_propietario │  │    fincas    │    │
│  │              │  │                  │  │              │    │
│  │ • id (UUID)  │  │ • finca_id (FK)  │  │ • id (UUID)  │    │
│  │ • nombre     │  │ • propietario_id │  │ • nombre     │    │
│  │ • documento  │  │   (FK)           │  │ • ubicacion  │    │
│  │ • telefono   │  └──────────────────┘  │ • area       │    │
│  │ • correo     │                        │ • coords     │    │
│  └──────────────┘                        └──────────────┘    │
│                                                       │         │
│                                                       ▼         │
│                                              ┌──────────────┐  │
│                                              │ actividades  │  │
│                                              │              │  │
│                                              │ • id (UUID)  │  │
│                                              │ • finca_id   │  │
│                                              │ • tipo       │  │
│                                              │ • cantidad   │  │
│                                              └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama de Secuencia - Crear Finca

```
Usuario     Frontend        Backend         PostgreSQL
   │           │              │                │
   │ Crear     │              │                │
   │ finca     │              │                │
   │──────────>│              │                │
   │           │              │                │
   │           │ POST /fincas │                │
   │           │ (datos)      │                │
   │           │─────────────>│                │
   │           │              │                │
   │           │              │ INSERT fincas  │
   │           │              │───────────────>│
   │           │              │                │
   │           │              │   finca_id     │
   │           │              │<───────────────│
   │           │              │                │
   │           │              │ INSERT         │
   │           │              │ finca_prop...  │
   │           │              │───────────────>│
   │           │              │                │
   │           │              │    201 OK      │
   │           │              │<───────────────│
   │           │              │                │
   │           │ 201 + JSON   │                │
   │           │<─────────────│                │
   │           │              │                │
   │  Success  │              │                │
   │<──────────│              │                │
   │           │              │                │
```

### Diagrama de Estados - Sincronización

```
┌─────────────┐
│   Offline   │
│             │
│ • CRUD      │
│  local en   │
│  SQLite     │
│             │
│ • synced    │
│  = false    │
└──────┬──────┘
       │
       │ Detecta conexión
       │ (connectivity_plus)
       │
       ▼
┌─────────────┐
│Sincronizando│
│             │
│ • Envía     │
│  pendientes │
│  a API      │
│             │
│ • Recibe    │
│  cambios    │
│  servidor   │
└──────┬──────┘
       │
       │ Éxito
       │
       ▼
┌─────────────┐
│    Online   │
│             │
│ • synced    │
│  = true     │
│             │
│ • Datos     │
│  actuali-   │
│  zados      │
└─────────────┘
```

---

## Instalación y Ejecución

### Requisitos Previos
- Docker y Docker Compose
- Node.js 20+ (para desarrollo sin Docker)
- Flutter SDK (para mobile app)
- PostgreSQL (si se ejecuta sin Docker)

### Ejecución con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd proyectoFincas

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Iniciar todos los servicios
docker compose up -d --build

# 4. Verificar servicios
docker compose ps

# 5. Acceder a servicios
# Frontend Admin: http://localhost:5173
# Frontend Offline: http://localhost:5175
# Backend API: http://localhost:3000
# PostgreSQL: localhost:5432
```

### Ejecución sin Docker (Desarrollo)

#### Backend
```bash
cd backend
npm install
npm run dev  # Con nodemon (auto-reload)
# o
npm start    # Producción
```

#### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev
```

#### Frontend Offline
```bash
cd frontend-offline
npm install
npm run dev
```

#### Mobile App
```bash
cd mobile-app
flutter pub get
flutter run
```

### Variables de Entorno

#### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fincas_db
DB_USER=postgres
DB_PASSWORD=postgres
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## Consideraciones de Seguridad

### Autenticación y Autorización
⚠️ **Nota**: La versión actual no incluye autenticación. Para producción se recomienda:
- Implementar JWT (JSON Web Tokens)
- Middleware de autenticación en Express
- Roles y permisos (admin, usuario, etc.)

### Validación de Datos
- Validación en frontend (UX)
- Validación en backend (seguridad)
- Sanitización de entradas
- Prevención de SQL injection (Sequelize ORM)

### CORS
- Configurado para permitir todos los orígenes en desarrollo
- En producción: restringir a dominios específicos

### HTTPS
- Requerido para producción
- Configurar en Nginx (frontends)
- Configurar en Express (backend)

---

## Próximas Mejoras

### Funcionalidades Pendientes
1. **Autenticación y Autorización**
   - Login/Registro de usuarios
   - Roles (admin, propietario, trabajador)
   - Permisos por recurso

2. **Módulo de Reportes**
   - Exportar a PDF/Excel
   - Gráficos avanzados
   - Filtros por fecha/región

3. **Notificaciones**
   - Push notifications (mobile)
   - Email notifications
   - Alertas de sincronización

4. **Módulo de Usuarios**
   - Gestión de usuarios del sistema
   - Perfiles y configuraciones
   - Historial de actividades

5. **Mejoras de Rendimiento**
   - Paginación en listados
   - Caché de consultas
   - Optimización de imágenes

6. **Características Avanzadas**
   - Mapas interactivos con polígonos
   - Importación masiva de datos
   - API de terceros (clima, suelos)

---

## Soporte y Contribución

### Problemas Comunes

#### Error: "Cannot connect to database"
**Solución**: Verificar que PostgreSQL esté corriendo y credenciales correctas en `.env`

#### Error: "Port already in use"
**Solución**: Cambiar puertos en `docker-compose.yml` o liberar puertos 3000, 5173, 5175

#### Error: "Module not found" en frontend
**Solución**: Ejecutar `npm install` en el directorio del frontend

#### Error: "Connection refused" en mobile app
**Solución**: Usar IP de red en lugar de localhost (ej: `http://192.168.1.100:3000`)

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Fecha de última actualización**: Mayo 2026  
**Versión del documento**: 1.0  
**Estado del proyecto**: En desarrollo activo