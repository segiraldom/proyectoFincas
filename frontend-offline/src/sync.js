import { getPendientes, marcarSincronizado } from './database.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
let sincronizando = false
let healthCheckFailures = 0
const MAX_HEALTH_FAILURES = 3

export function estaSincronizando() {
  return sincronizando
}

/**
 * Verifica si el backend está realmente disponible
 */
export async function verificarBackend() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      healthCheckFailures = 0
      return true
    }
    return false
  } catch {
    healthCheckFailures++
    return false
  }
}

/**
 * Sincroniza usando el endpoint batch del backend.
 * Envía todos los datos pendientes en una sola petición.
 */
export async function sincronizar(onProgress) {
  if (sincronizando) return
  sincronizando = true
  onProgress?.('sincronizando')

  try {
    // Primero verificar que el backend esté disponible
    const disponible = await verificarBackend()
    if (!disponible) {
      onProgress?.('error', { mensaje: 'Backend no disponible' })
      sincronizando = false
      return
    }

    const pendientes = getPendientes()
    const total = pendientes.length

    if (total === 0) {
      onProgress?.('sin_pendientes')
      sincronizando = false
      return
    }

    // Organizar datos por tipo para el endpoint batch
    const batch = {
      propietarios: [],
      fincas: [],
      actividades: [],
      finca_propietario: []
    }

    for (const item of pendientes) {
      if (item.tipo === 'propietario') {
        batch.propietarios.push(item.data)
      } else if (item.tipo === 'finca') {
        batch.fincas.push(item.data)
      } else if (item.tipo === 'actividad') {
        batch.actividades.push(item.data)
      } else if (item.tipo === 'finca_propietario') {
        batch.finca_propietario.push(item.data)
      }
    }

    onProgress?.('progreso', { enviados: 0, total })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const res = await fetch(`${API_URL}/api/sync/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Error desconocido')
      throw new Error(`Error ${res.status}: ${errorText}`)
    }

    const result = await res.json()

    // Marcar todos como sincronizados
    for (const item of pendientes) {
      marcarSincronizado(item.tipo, item.tipo === 'finca_propietario' ? item.data : item.data.id)
    }

    onProgress?.('completado', { enviados: total })
  } catch (error) {
    console.error('Error en sincronización:', error)
    onProgress?.('error', { mensaje: error.message || 'Error al sincronizar' })
  } finally {
    sincronizando = false
  }
}