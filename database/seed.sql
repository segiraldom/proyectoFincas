-- =====================================
-- LIMPIEZA PREVIA
-- =====================================

TRUNCATE TABLE finca_propietario RESTART IDENTITY CASCADE;
TRUNCATE TABLE actividades RESTART IDENTITY CASCADE;
TRUNCATE TABLE fincas RESTART IDENTITY CASCADE;
TRUNCATE TABLE propietarios RESTART IDENTITY CASCADE;

-- =====================================
-- PROPIETARIOS
-- =====================================

INSERT INTO propietarios (id, nombre, documento, telefono, correo) VALUES
('a1111111-1111-1111-1111-111111111111', 'Carlos Andrés Mejía', 'CC1001001', '3001112233', 'carlos.mejia@fincas.co'),
('a2222222-2222-2222-2222-222222222222', 'María Fernanda López', 'CC1001002', '3002223344', 'maria.lopez@fincas.co'),
('a3333333-3333-3333-3333-333333333333', 'Jorge Iván Ramírez', 'CC1001003', '3003334455', 'jorge.ramirez@fincas.co'),
('a4444444-4444-4444-4444-444444444444', 'Ana Lucía Torres', 'CC1001004', '3004445566', 'ana.torres@fincas.co'),
('a5555555-5555-5555-5555-555555555555', 'Luis Alberto Gómez', 'CC1001005', '3005556677', 'luis.gomez@fincas.co');

-- =====================================
-- FINCAS
-- =====================================

INSERT INTO fincas (id, nombre, departamento, municipio, area_total_hectareas, latitud, longitud) VALUES
('b1111111-1111-1111-1111-111111111111', 'Finca El Progreso', 'Antioquia', 'Medellín', 120.50, 6.24420300, -75.58121500),
('b2222222-2222-2222-2222-222222222222', 'Hacienda La Esperanza', 'Cundinamarca', 'Fusagasugá', 80.00, 4.33712300, -74.36489900),
('b3333333-3333-3333-3333-333333333333', 'Finca San Isidro', 'Caldas', 'Manizales', 55.75, 5.07027500, -75.51381700),
('b4444444-4444-4444-4444-444444444444', 'Finca Monte Verde', 'Nariño', 'Pasto', 95.30, 1.20588300, -77.28286800);

-- =====================================
-- RELACIÓN FINCA - PROPIETARIO
-- =====================================

INSERT INTO finca_propietario (finca_id, propietario_id) VALUES
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111'),
('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222'),
('b2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333'),
('b3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444'),
('b4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555');

-- =====================================
-- ACTIVIDADES PRODUCTIVAS
-- =====================================

INSERT INTO actividades (
  id, finca_id, tipo, descripcion, cantidad, unidad, produccion, unidad_produccion, area_hectareas
) VALUES
('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Ganadería', 'Producción de leche especializada', 180, 'cabezas', 12500, 'litros/mes', 70.00),
('c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Pastos', 'Manejo rotacional de praderas', 45, 'lotes', 0, 'N/A', 50.50),
('c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Horticultura', 'Cultivo de tomate chonto', 25000, 'plantas', 42000, 'kg/año', 35.00),
('c4444444-4444-4444-4444-444444444444', 'b3333333-3333-3333-3333-333333333333', 'Caficultura', 'Café arábigo de altura', 18000, 'árboles', 3800, 'kg/año', 40.00),
('c5555555-5555-5555-5555-555555555555', 'b4444444-4444-4444-4444-444444444444', 'Papa', 'Producción de papa criolla', 600, 'surcos', 29000, 'kg/cosecha', 52.00);


