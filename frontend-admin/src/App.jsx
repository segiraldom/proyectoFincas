import { useEffect, useMemo, useState } from 'react'
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
              </tr>
            ))}
          </tbody>
        </table>
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
          </tr>
        </thead>
        <tbody>
          {propietarios.map((propietario) => (
            <tr key={propietario.id}>
              <td>{propietario.nombre}</td>
              <td>{propietario.documento}</td>
              <td>{propietario.telefono || 'N/A'}</td>
              <td>{propietario.correo || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <h1>Fincas Rurales</h1>
        <p>Sistema Administrativo</p>
        <nav>
          <button className={activeTab === 'fincas' ? 'active' : ''} onClick={() => setActiveTab('fincas')}>Fincas</button>
          <button className={activeTab === 'actividades' ? 'active' : ''} onClick={() => setActiveTab('actividades')}>Actividades</button>
          <button className={activeTab === 'propietarios' ? 'active' : ''} onClick={() => setActiveTab('propietarios')}>Propietarios</button>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <h2>Panel administrativo</h2>
          <button onClick={loadData}>Actualizar</button>
        </header>

        <section className="cards">
          {cards.map((card) => (
            <article key={card.label} className="card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </section>

        {loading ? <p className="state">Cargando datos...</p> : null}
        {error ? <p className="state error">{error}</p> : null}

        {!loading && !error ? <section className="table-wrapper">{renderTable()}</section> : null}
      </main>
    </div>
  )
}

export default App
