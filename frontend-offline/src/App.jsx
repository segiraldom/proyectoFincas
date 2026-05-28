import { useEffect, useMemo, useRef, useState } from 'react'
import {
  initDatabase,
  crearPropietario,
  listarPropietarios,
  crearFinca,
  listarFincas,
  crearActividad,
  listarActividades,
} from './database.js'
import { sincronizar, estaSincronizando, verificarBackend } from './sync.js'
import './App.css'

function App() {
   const [dbReady, setDbReady] = useState(false)
   const [errorInit, setErrorInit] = useState(null)
  const [backendOnline, setBackendOnline] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [syncState, setSyncState] = useState('idle')
  const [syncMsg, setSyncMsg] = useState('')
  const [tab, setTab] = useState('fincas')
  const syncIntervalRef = useRef(null)

  const [fincas, setFincas] = useState([])
  const [propietarios, setPropietarios] = useState([])

  // formularios
  const [pForm, setPForm] = useState({ nombre: '', documento: '', telefono: '', correo: '' })
  const [fForm, setFForm] = useState({ nombre: '', departamento: '', municipio: '', area: '', lat: '', lng: '', propietarios: [] })
  const [aForm, setAForm] = useState({ finca_id: '', tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })

  // finca seleccionada para detalle
  const [detalle, setDetalle] = useState(null)
  const [actividadesDetalle, setActividadesDetalle] = useState([])
  const [nuevaActividad, setNuevaActividad] = useState({ tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })

  // Health check periódico al backend cada 15s
  useEffect(() => {
    const checkHealth = async () => {
      const disponible = await verificarBackend()
      setBackendOnline(disponible)
      setOnline(disponible)
    }

    checkHealth() // verificar al montar
    const healthInterval = setInterval(checkHealth, 15000)

    window.addEventListener('online', checkHealth)
    window.addEventListener('offline', () => {
      setOnline(false)
      setBackendOnline(false)
    })

    return () => {
      clearInterval(healthInterval)
      window.removeEventListener('online', checkHealth)
    }
  }, [])

// init DB
   useEffect(() => {
     ;(async () => {
       try {
         await initDatabase()
         setDbReady(true)
         cargarDatos()
       } catch (err) {
         console.error('Error al inicializar DB:', err)
         setErrorInit(err.message || 'Error desconocido')
       }
     })()
   }, [])

  const cargarDatos = () => {
    setFincas(listarFincas())
    setPropietarios(listarPropietarios())
  }

  const totalPendientes = useMemo(() => {
    let count = 0
    fincas.forEach((f) => { if (!f.sincronizado) count++ })
    propietarios.forEach((p) => { if (!p.sincronizado) count++ })
    return count
  }, [fincas, propietarios])

  const handleSync = async () => {
    if (estaSincronizando()) return
    setSyncState('sincronizando')
    setSyncMsg('Iniciando sincronización...')
    await sincronizar((evento, data) => {
      if (evento === 'sincronizando') setSyncMsg('Preparando datos pendientes...')
      else if (evento === 'progreso') setSyncMsg(`Enviados ${data.enviados} de ${data.total}...`)
      else if (evento === 'completado') {
        setSyncMsg(`✔ ${data.enviados} registros sincronizados`)
        setSyncState('ok')
        cargarDatos()
        setTimeout(() => { setSyncState('idle'); setSyncMsg('') }, 3000)
      }
      else if (evento === 'sin_pendientes') {
        setSyncMsg('✔ No hay datos pendientes')
        setSyncState('ok')
        setTimeout(() => { setSyncState('idle'); setSyncMsg('') }, 2000)
      }
      else if (evento === 'error') {
        setSyncMsg(`✘ ${data?.mensaje || 'Error al sincronizar'}`)
        setSyncState('error')
        setTimeout(() => { setSyncState('idle'); setSyncMsg('') }, 5000)
      }
    })
  }

  // Auto-sync cuando el backend está disponible y hay pendientes
  useEffect(() => {
    if (backendOnline && totalPendientes > 0 && !estaSincronizando()) {
      handleSync()
    }
  }, [backendOnline, totalPendientes])

  // Reintento periódico cada 30s mientras haya pendientes y backend disponible
  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current)
      syncIntervalRef.current = null
    }

    if (backendOnline && totalPendientes > 0) {
      syncIntervalRef.current = setInterval(() => {
        if (!estaSincronizando() && totalPendientes > 0) {
          handleSync()
        }
      }, 30000)
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [backendOnline, totalPendientes])

  const handleCrearPropietario = (e) => {
    e.preventDefault()
    crearPropietario(pForm.nombre, pForm.documento, pForm.telefono, pForm.correo)
    setPForm({ nombre: '', documento: '', telefono: '', correo: '' })
    cargarDatos()
  }

  const handleCrearFinca = (e) => {
    e.preventDefault()
    crearFinca(
      fForm.nombre, fForm.departamento, fForm.municipio,
      fForm.area, fForm.lat, fForm.lng,
      fForm.propietarios,
    )
    setFForm({ nombre: '', departamento: '', municipio: '', area: '', lat: '', lng: '', propietarios: [] })
    cargarDatos()
  }

  const handleCrearActividad = (e) => {
    e.preventDefault()
    const id = crearActividad(
      aForm.finca_id, aForm.tipo, aForm.descripcion,
      aForm.cantidad, aForm.unidad, aForm.produccion,
      aForm.unidad_produccion, aForm.area_hectareas,
    )
    setAForm({ finca_id: '', tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })
    cargarDatos()
  }

  const verDetalle = (finca) => {
    setDetalle(finca)
    setActividadesDetalle(listarActividades(finca.id))
    setNuevaActividad({ tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })
  }

  const agregarActividadADetalle = (e) => {
    e.preventDefault()
    crearActividad(
      detalle.id, nuevaActividad.tipo, nuevaActividad.descripcion,
      nuevaActividad.cantidad, nuevaActividad.unidad, nuevaActividad.produccion,
      nuevaActividad.unidad_produccion, nuevaActividad.area_hectareas,
    )
    setActividadesDetalle(listarActividades(detalle.id))
    setNuevaActividad({ tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })
    cargarDatos()
  }

if (errorInit) {
     return <div className="app-offline"><p className="error">Error: {errorInit}</p></div>
   }

   if (!dbReady) {
     return <div className="app-offline"><p className="cargando">Inicializando base de datos local...</p></div>
   }

  return (
    <div className="app-offline">
      <header className="offline-header">
        <h1>📋 Registro Fincas</h1>
        <p className="offline-subtitle">Captura offline • SQLite local</p>
        <div className="status-bar">
          <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`} />
          <span>{backendOnline ? '✅ Conectado' : '❌ Sin conexión'}</span>
          <span className="sep">|</span>
          <span>📦 Pendientes: {totalPendientes}</span>
          {backendOnline && totalPendientes > 0 && (
            <span className="auto-sync-badge">⏳ Auto-sync activo</span>
          )}
          {syncState !== 'idle' && (
            <span className={`sync-msg ${syncState}`}>{syncMsg}</span>
          )}
        </div>
        <button className="btn-sync" onClick={handleSync} disabled={estaSincronizando()}>
          {estaSincronizando() ? '⏳ Sincronizando...' : '🔄 Sincronizar ahora'}
        </button>
      </header>

      <nav className="offline-nav">
        <button className={tab === 'fincas' ? 'active' : ''} onClick={() => setTab('fincas')}>Fincas</button>
        <button className={tab === 'propietarios' ? 'active' : ''} onClick={() => setTab('propietarios')}>Propietarios</button>
        <button className={tab === 'actividades' ? 'active' : ''} onClick={() => setTab('actividades')}>Actividades</button>
      </nav>

      <main className="offline-content">
        {tab === 'fincas' && (
          <>
            <form className="offline-form" onSubmit={handleCrearFinca}>
              <h3>Nueva finca</h3>
              <input placeholder="Nombre" value={fForm.nombre} onChange={(e) => setFForm({ ...fForm, nombre: e.target.value })} required />
              <input placeholder="Departamento" value={fForm.departamento} onChange={(e) => setFForm({ ...fForm, departamento: e.target.value })} required />
              <input placeholder="Municipio" value={fForm.municipio} onChange={(e) => setFForm({ ...fForm, municipio: e.target.value })} required />
              <input placeholder="Área (ha)" type="number" step="0.01" value={fForm.area} onChange={(e) => setFForm({ ...fForm, area: e.target.value })} />
              <input placeholder="Latitud" type="number" step="0.000001" value={fForm.lat} onChange={(e) => setFForm({ ...fForm, lat: e.target.value })} />
              <input placeholder="Longitud" type="number" step="0.000001" value={fForm.lng} onChange={(e) => setFForm({ ...fForm, lng: e.target.value })} />
              <select multiple value={fForm.propietarios} onChange={(e) => setFForm({ ...fForm, propietarios: Array.from(e.target.selectedOptions, (o) => o.value) })}>
                {propietarios.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <button type="submit">Guardar finca</button>
            </form>

            <div className="lista">
              {fincas.map((f) => (
                <div key={f.id} className={`item-card ${detalle?.id === f.id ? 'selected' : ''}`} onClick={() => verDetalle(f)}>
                  <strong>{f.nombre}</strong>
                  <span>{f.departamento} - {f.municipio}</span>
                  <span>{f.area_total_hectareas ?? 0} ha</span>
                  {!f.sincronizado && <span className="badge-pendiente">Pendiente</span>}
                </div>
              ))}
              {fincas.length === 0 && <p className="vacio">No hay fincas registradas</p>}
            </div>

            {detalle && (
              <div className="detalle">
                <h3>📌 {detalle.nombre}</h3>
                <p>{detalle.departamento} - {detalle.municipio} | {detalle.area_total_hectareas ?? 0} ha</p>

                <h4>Actividades</h4>
                {actividadesDetalle.map((a) => (
                  <div key={a.id} className="actividad-item">
                    <strong>{a.tipo}</strong> — {a.descripcion || 'Sin descripción'}
                    <br />
                    {a.cantidad} {a.unidad} | Prod: {a.produccion} {a.unidad_produccion} | Área: {a.area_hectareas} ha
                    {!a.sincronizado && <span className="badge-pendiente"> Pendiente</span>}
                  </div>
                ))}

                <form className="offline-form" onSubmit={agregarActividadADetalle}>
                  <h4>Añadir actividad</h4>
                  <input placeholder="Tipo" value={nuevaActividad.tipo} onChange={(e) => setNuevaActividad({ ...nuevaActividad, tipo: e.target.value })} required />
                  <input placeholder="Descripción" value={nuevaActividad.descripcion} onChange={(e) => setNuevaActividad({ ...nuevaActividad, descripcion: e.target.value })} />
                  <input placeholder="Cantidad" type="number" step="0.01" value={nuevaActividad.cantidad} onChange={(e) => setNuevaActividad({ ...nuevaActividad, cantidad: e.target.value })} />
                  <input placeholder="Unidad" value={nuevaActividad.unidad} onChange={(e) => setNuevaActividad({ ...nuevaActividad, unidad: e.target.value })} />
                  <input placeholder="Producción" type="number" step="0.01" value={nuevaActividad.produccion} onChange={(e) => setNuevaActividad({ ...nuevaActividad, produccion: e.target.value })} />
                  <input placeholder="Unidad producción" value={nuevaActividad.unidad_produccion} onChange={(e) => setNuevaActividad({ ...nuevaActividad, unidad_produccion: e.target.value })} />
                  <input placeholder="Área (ha)" type="number" step="0.01" value={nuevaActividad.area_hectareas} onChange={(e) => setNuevaActividad({ ...nuevaActividad, area_hectareas: e.target.value })} />
                  <button type="submit">Añadir actividad</button>
                </form>
              </div>
            )}
          </>
        )}

        {tab === 'propietarios' && (
          <>
            <form className="offline-form" onSubmit={handleCrearPropietario}>
              <h3>Nuevo propietario</h3>
              <input placeholder="Nombre" value={pForm.nombre} onChange={(e) => setPForm({ ...pForm, nombre: e.target.value })} required />
              <input placeholder="Documento" value={pForm.documento} onChange={(e) => setPForm({ ...pForm, documento: e.target.value })} required />
              <input placeholder="Teléfono" value={pForm.telefono} onChange={(e) => setPForm({ ...pForm, telefono: e.target.value })} />
              <input placeholder="Correo" type="email" value={pForm.correo} onChange={(e) => setPForm({ ...pForm, correo: e.target.value })} />
              <button type="submit">Guardar propietario</button>
            </form>

            <div className="lista">
              {propietarios.map((p) => (
                <div key={p.id} className="item-card">
                  <strong>{p.nombre}</strong>
                  <span>{p.documento}</span>
                  <span>{p.telefono || 'N/A'}</span>
                  {!p.sincronizado && <span className="badge-pendiente">Pendiente</span>}
                </div>
              ))}
              {propietarios.length === 0 && <p className="vacio">No hay propietarios registrados</p>}
            </div>
          </>
        )}

        {tab === 'actividades' && (
          <>
            <form className="offline-form" onSubmit={handleCrearActividad}>
              <h3>Nueva actividad</h3>
              <select value={aForm.finca_id} onChange={(e) => setAForm({ ...aForm, finca_id: e.target.value })} required>
                <option value="">Seleccione finca</option>
                {fincas.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
              <input placeholder="Tipo (Ej: Ganadería, Caficultura)" value={aForm.tipo} onChange={(e) => setAForm({ ...aForm, tipo: e.target.value })} required />
              <input placeholder="Descripción" value={aForm.descripcion} onChange={(e) => setAForm({ ...aForm, descripcion: e.target.value })} />
              <input placeholder="Cantidad" type="number" step="0.01" value={aForm.cantidad} onChange={(e) => setAForm({ ...aForm, cantidad: e.target.value })} />
              <input placeholder="Unidad" value={aForm.unidad} onChange={(e) => setAForm({ ...aForm, unidad: e.target.value })} />
              <input placeholder="Producción" type="number" step="0.01" value={aForm.produccion} onChange={(e) => setAForm({ ...aForm, produccion: e.target.value })} />
              <input placeholder="Unidad producción" value={aForm.unidad_produccion} onChange={(e) => setAForm({ ...aForm, unidad_produccion: e.target.value })} />
              <input placeholder="Área (ha)" type="number" step="0.01" value={aForm.area_hectareas} onChange={(e) => setAForm({ ...aForm, area_hectareas: e.target.value })} />
              <button type="submit">Guardar actividad</button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}

export default App