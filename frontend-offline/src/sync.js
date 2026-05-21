import { getPendientes, marcarSincronizado } from './database.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
let sincronizando = false

export function estaSincronizando() {
  return sincronizando
}

export async function sincronizar(onProgress) {
  if (sincronizando) return
  sincronizando = true
  onProgress?.('sincronizando')

  try {
    const pendientes = getPendientes()
    let enviados = 0
    const total = pendientes.length

    if (total === 0) {
      onProgress?.('sin_pendientes')
      sincronizando = false
      return
    }

    for (const item of pendientes) {
      try {
        if (item.tipo === 'finca_propietario') {
          await fetch(`${API_URL}/api/finca-propietario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        } else if (item.tipo === 'finca') {
          await fetch(`${API_URL}/api/fincas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        } else if (item.tipo === 'actividad') {
          await fetch(`${API_URL}/api/actividades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        } else if (item.tipo === 'propietario') {
          await fetch(`${API_URL}/api/propietarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        }

        marcarSincronizado(item.tipo, item.tipo === 'finca_propietario' ? item.data : item.data.id)
        enviados++
        onProgress?.('progreso', { enviados, total })
      } catch {
        // falla individual no detiene todo el lote
      }
    }

    onProgress?.('completado', { enviados })
  } catch {
    onProgress?.('error')
  } finally {
    sincronizando = false
  }
}