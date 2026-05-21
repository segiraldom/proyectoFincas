let db = null

export async function initDatabase() {
  const initSqlJs = (await import('sql.js')).default
  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
  }).catch((err) => {
    console.error('Error loading SQL.js:', err)
    throw err
  })
  db = new SQL.Database()

  db.run(`
    CREATE TABLE IF NOT EXISTS propietarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      documento TEXT NOT NULL,
      telefono TEXT,
      correo TEXT,
      fecha_registro TEXT DEFAULT (datetime('now')),
      sincronizado INTEGER DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS fincas (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      departamento TEXT NOT NULL,
      municipio TEXT NOT NULL,
      area_total_hectareas REAL,
      latitud REAL,
      longitud REAL,
      fecha_registro TEXT DEFAULT (datetime('now')),
      sincronizado INTEGER DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS actividades (
      id TEXT PRIMARY KEY,
      finca_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      descripcion TEXT,
      cantidad REAL,
      unidad TEXT,
      produccion REAL,
      unidad_produccion TEXT,
      area_hectareas REAL,
      fecha_registro TEXT DEFAULT (datetime('now')),
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (finca_id) REFERENCES fincas(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS finca_propietario (
      finca_id TEXT NOT NULL,
      propietario_id TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0,
      PRIMARY KEY (finca_id, propietario_id)
    )
  `)

  return db
}

export function getDb() {
  if (!db) throw new Error('Base de datos no inicializada')
  return db
}

// --- PROPIETARIOS ---

export function crearPropietario(nombre, documento, telefono, correo) {
  const id = crypto.randomUUID()
  const d = getDb()
  d.run(
    'INSERT INTO propietarios (id, nombre, documento, telefono, correo) VALUES (?, ?, ?, ?, ?)',
    [id, nombre, documento, telefono || null, correo || null],
  )
  return id
}

export function listarPropietarios() {
  return getDb()
    .exec('SELECT * FROM propietarios ORDER BY fecha_registro DESC')
    .map((r) => rowToObj(r, ['id', 'nombre', 'documento', 'telefono', 'correo', 'fecha_registro', 'sincronizado']))
}

export function obtenerPropietario(id) {
  const r = getDb().exec('SELECT * FROM propietarios WHERE id = ?', [id])
  if (!r.length) return null
  const row = r[0]
  return rowToObj(row, ['id', 'nombre', 'documento', 'telefono', 'correo', 'fecha_registro', 'sincronizado'])
}

// --- FINCAS ---

export function crearFinca(nombre, departamento, municipio, area, lat, lng, propietariosIds = []) {
  const id = crypto.randomUUID()
  const d = getDb()
  d.run(
    'INSERT INTO fincas (id, nombre, departamento, municipio, area_total_hectareas, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, nombre, departamento, municipio, area || 0, lat || null, lng || null],
  )
  for (const pid of propietariosIds) {
    d.run(
      'INSERT INTO finca_propietario (finca_id, propietario_id) VALUES (?, ?)',
      [id, pid],
    )
  }
  return id
}

export function listarFincas() {
  const d = getDb()
  const fincas = d
    .exec('SELECT * FROM fincas ORDER BY fecha_registro DESC')
    .map((r) => rowToObj(r, ['id', 'nombre', 'departamento', 'municipio', 'area_total_hectareas', 'latitud', 'longitud', 'fecha_registro', 'sincronizado']))

  for (const f of fincas) {
    const rels = d
      .exec('SELECT propietario_id FROM finca_propietario WHERE finca_id = ?', [f.id])
      .map((r) => r.values[0][0])
    f.propietarios = rels.map((pid) => obtenerPropietario(pid)).filter(Boolean)
  }

  return fincas
}

// --- ACTIVIDADES ---

export function crearActividad(fincaId, tipo, descripcion, cantidad, unidad, produccion, unidadProd, area) {
  const id = crypto.randomUUID()
  getDb().run(
    'INSERT INTO actividades (id, finca_id, tipo, descripcion, cantidad, unidad, produccion, unidad_produccion, area_hectareas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, fincaId, tipo, descripcion || null, cantidad || 0, unidad || null, produccion || 0, unidadProd || null, area || 0],
  )
  return id
}

export function listarActividades(fincaId) {
  const d = getDb()
  const rows = fincaId
    ? d.exec('SELECT * FROM actividades WHERE finca_id = ? ORDER BY fecha_registro DESC', [fincaId])
    : d.exec('SELECT * FROM actividades ORDER BY fecha_registro DESC')

  return rows.map((r) =>
    rowToObj(r, ['id', 'finca_id', 'tipo', 'descripcion', 'cantidad', 'unidad', 'produccion', 'unidad_produccion', 'area_hectareas', 'fecha_registro', 'sincronizado']),
  )
}

// --- SINCRONIZACIÓN ---

export function getPendientes() {
  const d = getDb()
  const pendientes = []

  const propietarios = d
    .exec('SELECT * FROM propietarios WHERE sincronizado = 0')
    .map((r) => ({ tipo: 'propietario', data: rowToObj(r, ['id', 'nombre', 'documento', 'telefono', 'correo', 'fecha_registro', 'sincronizado']) }))
  pendientes.push(...propietarios)

  const fincas = d
    .exec('SELECT * FROM fincas WHERE sincronizado = 0')
    .map((r) => ({ tipo: 'finca', data: rowToObj(r, ['id', 'nombre', 'departamento', 'municipio', 'area_total_hectareas', 'latitud', 'longitud', 'fecha_registro', 'sincronizado']) }))
  pendientes.push(...fincas)

  const actividades = d
    .exec('SELECT * FROM actividades WHERE sincronizado = 0')
    .map((r) => ({ tipo: 'actividad', data: rowToObj(r, ['id', 'finca_id', 'tipo', 'descripcion', 'cantidad', 'unidad', 'produccion', 'unidad_produccion', 'area_hectareas', 'fecha_registro', 'sincronizado']) }))
  pendientes.push(...actividades)

  const relaciones = d
    .exec('SELECT * FROM finca_propietario WHERE sincronizado = 0')
    .map((r) => ({ tipo: 'finca_propietario', data: { finca_id: r.values[0][0], propietario_id: r.values[0][1] } }))
  pendientes.push(...relaciones)

  return pendientes
}

export function marcarSincronizado(tipo, id) {
  const d = getDb()
  if (tipo === 'finca_propietario') {
    d.run('UPDATE finca_propietario SET sincronizado = 1 WHERE finca_id = ? AND propietario_id = ?', [id.finca_id, id.propietario_id])
  } else {
    d.run(`UPDATE ${tipo}s SET sincronizado = 1 WHERE id = ?`, [id])
  }
}

// HELPER

function rowToObj(row, columns) {
  const obj = {}
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = row.values[0][i]
  }
  return obj
}