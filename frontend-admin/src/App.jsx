import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [activeTab, setActiveTab] = useState('fincas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [stats, setStats] = useState({
    totalFincas: 0,
    totalActividades: 0,
    totalPropietarios: 0,
    totalHectareas: 0,
  })

  const [fincas, setFincas] = useState([])
  const [actividades, setActividades] = useState([])
  const [propietarios, setPropietarios] = useState([])
  const [mapFilters, setMapFilters] = useState({
    departamento: 'TODOS',
    actividad: 'TODAS',
  })

  const fincasConUbicacion = useMemo(
    () =>
      fincas.filter(
        (finca) =>
          finca.latitud !== null &&
          finca.longitud !== null &&
          !Number.isNaN(Number(finca.latitud)) &&
          !Number.isNaN(Number(finca.longitud)),
      ),
    [fincas],
  )

  const departamentosDisponibles = useMemo(() => {
    return [...new Set(fincas.map((f) => f.departamento).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
  }, [fincas])

  const actividadesDisponibles = useMemo(() => {
    return [...new Set(actividades.map((a) => a.tipo).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
  }, [actividades])

  const fincaIdsConActividadFiltro = useMemo(() => {
    if (mapFilters.actividad === 'TODAS') return null
    return new Set(
      actividades
        .filter((a) => a.tipo === mapFilters.actividad)
        .map((a) => a.finca_id)
        .filter(Boolean),
    )
  }, [actividades, mapFilters.actividad])

  const fincasMapaFiltradas = useMemo(() => {
    return fincasConUbicacion.filter((finca) => {
      const cumpleDepartamento =
        mapFilters.departamento === 'TODOS' || finca.departamento === mapFilters.departamento

      const cumpleActividad =
        mapFilters.actividad === 'TODAS' ||
        (fincaIdsConActividadFiltro && fincaIdsConActividadFiltro.has(finca.id))

      return cumpleDepartamento && cumpleActividad
    })
  }, [fincasConUbicacion, mapFilters, fincaIdsConActividadFiltro])

  const actividadesPorFinca = useMemo(() => {
    const map = new Map()
    actividades.forEach((a) => {
      if (!a.finca_id) return
      if (!map.has(a.finca_id)) map.set(a.finca_id, [])
      map.get(a.finca_id).push(a)
    })
    return map
  }, [actividades])

  const statsFiltradosMapa = useMemo(() => {
    const fincaIds = new Set(fincasMapaFiltradas.map((f) => f.id))
    const actividadesFiltradas = actividades.filter(
      (a) => fincaIds.has(a.finca_id) && (mapFilters.actividad === 'TODAS' || a.tipo === mapFilters.actividad),
    )

    const propietariosIds = new Set()
    fincasMapaFiltradas.forEach((f) => (f.propietarios || []).forEach((p) => propietariosIds.add(p.id)))

    const hectareas = fincasMapaFiltradas.reduce(
      (acc, f) => acc + Number(f.area_total_hectareas || 0),
      0,
    )

    return {
      totalFincas: fincasMapaFiltradas.length,
      totalActividades: actividadesFiltradas.length,
      totalPropietarios: propietariosIds.size,
      totalHectareas: hectareas,
    }
  }, [fincasMapaFiltradas, actividades, mapFilters.actividad])

  const [saving, setSaving] = useState(false)

  const [fincaForm, setFincaForm] = useState({
    id: null,
    nombre: '',
    departamento: '',
    municipio: '',
    area_total_hectareas: '',
    latitud: '',
    longitud: '',
    propietarios: [],
  })

  const [actividadForm, setActividadForm] = useState({
    id: null,
    finca_id: '',
    tipo: '',
    descripcion: '',
    cantidad: '',
    unidad: '',
    produccion: '',
    unidad_produccion: '',
    area_hectareas: '',
  })

  const [propietarioForm, setPropietarioForm] = useState({
    id: null,
    nombre: '',
    documento: '',
    telefono: '',
    correo: '',
  })

  const cards = useMemo(
    () => [
      { label: 'Fincas registradas', value: stats.totalFincas },
      { label: 'Actividades productivas', value: stats.totalActividades },
      { label: 'Propietarios', value: stats.totalPropietarios },
      { label: 'Hectáreas totales', value: Number(stats.totalHectareas || 0).toFixed(2) },
    ],
    [stats],
  )

  const fetchJson = async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`)
    if (!response.ok) {
      throw new Error(`Error ${response.status} consultando ${path}`)
    }
    return response.json()
  }

  const sendJson = async (path, method, payload) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || `Error ${response.status}`)
    }

    return response.status === 204 ? null : response.json()
  }

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [statsData, fincasData, actividadesData, propietariosData] = await Promise.all([
        fetchJson('/api/estadisticas'),
        fetchJson('/api/fincas'),
        fetchJson('/api/actividades'),
        fetchJson('/api/propietarios'),
      ])

      setStats(statsData)
      setFincas(fincasData)
      setActividades(actividadesData)
      setPropietarios(propietariosData)
    } catch (err) {
      setError(err.message || 'No fue posible cargar la información')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const renderTable = () => {
    if (activeTab === 'fincas') {
      return (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Municipio</th>
              <th>Área (ha)</th>
              <th>Propietarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fincas.map((finca) => (
              <tr key={finca.id}>
                <td>{finca.nombre}</td>
                <td>{finca.departamento}</td>
                <td>{finca.municipio}</td>
                <td>{finca.area_total_hectareas ?? 0}</td>
                <td>{finca.propietarios?.length ?? 0}</td>
                {renderActions(finca, 'fincas')}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (activeTab === 'actividades') {
      return (
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Producción</th>
              <th>Finca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => (
              <tr key={actividad.id}>
                <td>{actividad.tipo}</td>
                <td>{actividad.descripcion || 'N/A'}</td>
                <td>{actividad.cantidad ?? 0} {actividad.unidad || ''}</td>
                <td>{actividad.produccion ?? 0} {actividad.unidad_produccion || ''}</td>
                <td>{actividad.finca?.nombre || actividad.finca_id}</td>
                {renderActions(actividad, 'actividades')}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (activeTab === 'mapa') {
      return (
        <div className="map-block">
          <h3>Ubicación de fincas registradas</h3>
          {fincasMapaFiltradas.length === 0 ? (
            <p className="state">No hay fincas con latitud/longitud para mostrar.</p>
          ) : (
            <MapContainer center={[4.5709, -74.2973]} zoom={6} scrollWheelZoom className="map-container">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {fincasMapaFiltradas.map((finca) => (
                <Marker key={finca.id} position={[Number(finca.latitud), Number(finca.longitud)]}>
                  <Popup>
                    <strong>{finca.nombre}</strong>
                    <br />
                    {finca.departamento} - {finca.municipio}
                    <br />
                    Área: {finca.area_total_hectareas ?? 0} ha
                    <br />
                    <strong>Actividades:</strong>{' '}
                    {(actividadesPorFinca.get(finca.id) || []).map((a) => a.tipo).join(', ') || 'Sin actividades'}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      )
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propietarios.map((propietario) => (
            <tr key={propietario.id}>
              <td>{propietario.nombre}</td>
              <td>{propietario.documento}</td>
              <td>{propietario.telefono || 'N/A'}</td>
              <td>{propietario.correo || 'N/A'}</td>
              {renderActions(propietario, 'propietarios')}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const resetForms = () => {
    setFincaForm({ id: null, nombre: '', departamento: '', municipio: '', area_total_hectareas: '', latitud: '', longitud: '', propietarios: [] })
    setActividadForm({ id: null, finca_id: '', tipo: '', descripcion: '', cantidad: '', unidad: '', produccion: '', unidad_produccion: '', area_hectareas: '' })
    setPropietarioForm({ id: null, nombre: '', documento: '', telefono: '', correo: '' })
  }

  const handleSubmitFinca = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        nombre: fincaForm.nombre,
        departamento: fincaForm.departamento,
        municipio: fincaForm.municipio,
        area_total_hectareas: Number(fincaForm.area_total_hectareas || 0),
        latitud: fincaForm.latitud === '' ? null : Number(fincaForm.latitud),
        longitud: fincaForm.longitud === '' ? null : Number(fincaForm.longitud),
        propietarios: fincaForm.propietarios,
      }

      if (fincaForm.id) {
        await sendJson(`/api/fincas/${fincaForm.id}`, 'PUT', payload)
      } else {
        await sendJson('/api/fincas', 'POST', payload)
      }

      resetForms()
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitActividad = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        finca_id: actividadForm.finca_id,
        tipo: actividadForm.tipo,
        descripcion: actividadForm.descripcion,
        cantidad: Number(actividadForm.cantidad || 0),
        unidad: actividadForm.unidad,
        produccion: Number(actividadForm.produccion || 0),
        unidad_produccion: actividadForm.unidad_produccion,
        area_hectareas: Number(actividadForm.area_hectareas || 0),
      }

      if (actividadForm.id) {
        await sendJson(`/api/actividades/${actividadForm.id}`, 'PUT', payload)
      } else {
        await sendJson('/api/actividades', 'POST', payload)
      }

      resetForms()
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitPropietario = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        nombre: propietarioForm.nombre,
        documento: propietarioForm.documento,
        telefono: propietarioForm.telefono,
        correo: propietarioForm.correo,
      }

      if (propietarioForm.id) {
        await sendJson(`/api/propietarios/${propietarioForm.id}`, 'PUT', payload)
      } else {
        await sendJson('/api/propietarios', 'POST', payload)
      }

      resetForms()
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (resource, id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return
    setSaving(true)
    setError('')
    try {
      await sendJson(`/api/${resource}/${id}`, 'DELETE')
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const renderForm = () => {
    if (activeTab === 'mapa') return null

    if (activeTab === 'fincas') {
      return (
        <form className="crud-form" onSubmit={handleSubmitFinca}>
          <h3>{fincaForm.id ? 'Editar finca' : 'Crear finca'}</h3>
          <input placeholder="Nombre" value={fincaForm.nombre} onChange={(e) => setFincaForm({ ...fincaForm, nombre: e.target.value })} required />
          <input placeholder="Departamento" value={fincaForm.departamento} onChange={(e) => setFincaForm({ ...fincaForm, departamento: e.target.value })} required />
          <input placeholder="Municipio" value={fincaForm.municipio} onChange={(e) => setFincaForm({ ...fincaForm, municipio: e.target.value })} required />
          <input placeholder="Área total" type="number" step="0.01" value={fincaForm.area_total_hectareas} onChange={(e) => setFincaForm({ ...fincaForm, area_total_hectareas: e.target.value })} />
          <input placeholder="Latitud" type="number" step="0.000001" value={fincaForm.latitud} onChange={(e) => setFincaForm({ ...fincaForm, latitud: e.target.value })} />
          <input placeholder="Longitud" type="number" step="0.000001" value={fincaForm.longitud} onChange={(e) => setFincaForm({ ...fincaForm, longitud: e.target.value })} />
          <select multiple value={fincaForm.propietarios} onChange={(e) => setFincaForm({ ...fincaForm, propietarios: Array.from(e.target.selectedOptions, (opt) => opt.value) })}>
            {propietarios.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <div className="form-actions">
            <button type="submit" disabled={saving}>{saving ? 'Guardando...' : fincaForm.id ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={resetForms}>Limpiar</button>
          </div>
        </form>
      )
    }

    if (activeTab === 'actividades') {
      return (
        <form className="crud-form" onSubmit={handleSubmitActividad}>
          <h3>{actividadForm.id ? 'Editar actividad' : 'Crear actividad'}</h3>
          <select value={actividadForm.finca_id} onChange={(e) => setActividadForm({ ...actividadForm, finca_id: e.target.value })} required>
            <option value="">Seleccione finca</option>
            {fincas.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select>
          <input placeholder="Tipo" value={actividadForm.tipo} onChange={(e) => setActividadForm({ ...actividadForm, tipo: e.target.value })} required />
          <input placeholder="Descripción" value={actividadForm.descripcion} onChange={(e) => setActividadForm({ ...actividadForm, descripcion: e.target.value })} />
          <input placeholder="Cantidad" type="number" step="0.01" value={actividadForm.cantidad} onChange={(e) => setActividadForm({ ...actividadForm, cantidad: e.target.value })} />
          <input placeholder="Unidad" value={actividadForm.unidad} onChange={(e) => setActividadForm({ ...actividadForm, unidad: e.target.value })} />
          <input placeholder="Producción" type="number" step="0.01" value={actividadForm.produccion} onChange={(e) => setActividadForm({ ...actividadForm, produccion: e.target.value })} />
          <input placeholder="Unidad producción" value={actividadForm.unidad_produccion} onChange={(e) => setActividadForm({ ...actividadForm, unidad_produccion: e.target.value })} />
          <input placeholder="Área hectáreas" type="number" step="0.01" value={actividadForm.area_hectareas} onChange={(e) => setActividadForm({ ...actividadForm, area_hectareas: e.target.value })} />
          <div className="form-actions">
            <button type="submit" disabled={saving}>{saving ? 'Guardando...' : actividadForm.id ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={resetForms}>Limpiar</button>
          </div>
        </form>
      )
    }

    return (
      <form className="crud-form" onSubmit={handleSubmitPropietario}>
        <h3>{propietarioForm.id ? 'Editar propietario' : 'Crear propietario'}</h3>
        <input placeholder="Nombre" value={propietarioForm.nombre} onChange={(e) => setPropietarioForm({ ...propietarioForm, nombre: e.target.value })} required />
        <input placeholder="Documento" value={propietarioForm.documento} onChange={(e) => setPropietarioForm({ ...propietarioForm, documento: e.target.value })} required />
        <input placeholder="Teléfono" value={propietarioForm.telefono} onChange={(e) => setPropietarioForm({ ...propietarioForm, telefono: e.target.value })} />
        <input placeholder="Correo" type="email" value={propietarioForm.correo} onChange={(e) => setPropietarioForm({ ...propietarioForm, correo: e.target.value })} />
        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Guardando...' : propietarioForm.id ? 'Actualizar' : 'Crear'}</button>
          <button type="button" onClick={resetForms}>Limpiar</button>
        </div>
      </form>
    )
  }

  const renderActions = (item, type) => (
    <td>
      <div className="row-actions">
        <button
          onClick={() => {
            if (type === 'fincas') {
              setFincaForm({
                id: item.id,
                nombre: item.nombre || '',
                departamento: item.departamento || '',
                municipio: item.municipio || '',
                area_total_hectareas: item.area_total_hectareas ?? '',
                latitud: item.latitud ?? '',
                longitud: item.longitud ?? '',
                propietarios: (item.propietarios || []).map((p) => p.id),
              })
            }
            if (type === 'actividades') {
              setActividadForm({
                id: item.id,
                finca_id: item.finca_id || '',
                tipo: item.tipo || '',
                descripcion: item.descripcion || '',
                cantidad: item.cantidad ?? '',
                unidad: item.unidad || '',
                produccion: item.produccion ?? '',
                unidad_produccion: item.unidad_produccion || '',
                area_hectareas: item.area_hectareas ?? '',
              })
            }
            if (type === 'propietarios') {
              setPropietarioForm({
                id: item.id,
                nombre: item.nombre || '',
                documento: item.documento || '',
                telefono: item.telefono || '',
                correo: item.correo || '',
              })
            }
          }}
        >
          Editar
        </button>
        <button className="danger" onClick={() => handleDelete(type, item.id)}>Eliminar</button>
      </div>
    </td>
  )

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <h1>Fincas Rurales</h1>
        <p>Sistema Administrativo</p>
        <nav>
          <button className={activeTab === 'fincas' ? 'active' : ''} onClick={() => setActiveTab('fincas')}>Fincas</button>
          <button className={activeTab === 'actividades' ? 'active' : ''} onClick={() => setActiveTab('actividades')}>Actividades</button>
          <button className={activeTab === 'propietarios' ? 'active' : ''} onClick={() => setActiveTab('propietarios')}>Propietarios</button>
          <button className={activeTab === 'mapa' ? 'active' : ''} onClick={() => setActiveTab('mapa')}>Mapa</button>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <h2>Panel administrativo</h2>
          <button onClick={loadData}>Actualizar</button>
        </header>

        {activeTab === 'mapa' ? (
          <div className="map-filters top-filters">
            <label>
              Departamento
              <select
                value={mapFilters.departamento}
                onChange={(e) => setMapFilters((prev) => ({ ...prev, departamento: e.target.value }))}
              >
                <option value="TODOS">Todos</option>
                {departamentosDisponibles.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Actividad
              <select
                value={mapFilters.actividad}
                onChange={(e) => setMapFilters((prev) => ({ ...prev, actividad: e.target.value }))}
              >
                <option value="TODAS">Todas</option>
                {actividadesDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {activeTab === 'mapa' ? (
          <section className="cards">
            {[
              { label: 'Fincas registradas', value: statsFiltradosMapa.totalFincas },
              { label: 'Actividades productivas', value: statsFiltradosMapa.totalActividades },
              { label: 'Propietarios', value: statsFiltradosMapa.totalPropietarios },
              { label: 'Hectáreas totales', value: Number(statsFiltradosMapa.totalHectareas || 0).toFixed(2) },
            ].map((card) => (
              <article key={card.label} className="card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </section>
        ) : null}

        {loading ? <p className="state">Cargando datos...</p> : null}
        {error ? <p className="state error">{error}</p> : null}

        {!loading && !error ? (
          <>
            {renderForm()}
            <section className="table-wrapper">{renderTable()}</section>
          </>
        ) : null}
      </main>
    </div>
  )
}

export default App
