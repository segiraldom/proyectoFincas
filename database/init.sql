CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- TABLA PROPIETARIOS
-- =====================================

CREATE TABLE IF NOT EXISTS propietarios (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(150) NOT NULL,

    documento VARCHAR(50) UNIQUE NOT NULL,

    telefono VARCHAR(30),

    correo VARCHAR(100),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- TABLA FINCAS
-- =====================================

CREATE TABLE IF NOT EXISTS fincas (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(150) NOT NULL,

    departamento VARCHAR(100) NOT NULL,

    municipio VARCHAR(100) NOT NULL,

    area_total_hectareas DECIMAL(10,2),

    latitud DECIMAL(10,8),

    longitud DECIMAL(11,8),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- TABLA RELACIÓN FINCA-PROPIETARIO
-- =====================================

CREATE TABLE IF NOT EXISTS finca_propietario (

    finca_id UUID NOT NULL,

    propietario_id UUID NOT NULL,

    PRIMARY KEY (finca_id, propietario_id),

    CONSTRAINT fk_finca
        FOREIGN KEY (finca_id)
        REFERENCES fincas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_propietario
        FOREIGN KEY (propietario_id)
        REFERENCES propietarios(id)
        ON DELETE CASCADE

);

-- =====================================
-- TABLA ACTIVIDADES
-- =====================================

CREATE TABLE IF NOT EXISTS actividades (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    finca_id UUID NOT NULL,

    tipo VARCHAR(100) NOT NULL,

    descripcion TEXT,

    cantidad DECIMAL(10,2),

    unidad VARCHAR(50),

    produccion DECIMAL(10,2),

    unidad_produccion VARCHAR(50),

    area_hectareas DECIMAL(10,2),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_finca_actividad
        FOREIGN KEY (finca_id)
        REFERENCES fincas(id)
        ON DELETE CASCADE

);

-- =====================================
-- ÍNDICES
-- =====================================

CREATE INDEX idx_fincas_departamento
ON fincas(departamento);

CREATE INDEX idx_actividades_tipo
ON actividades(tipo);

CREATE INDEX idx_propietarios_documento
ON propietarios(documento);