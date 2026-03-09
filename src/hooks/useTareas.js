// ============================================================
// useTareas — hook personalizado para sincronizar con Firebase
// ============================================================
// Maneja:
// - Suscripción en tiempo real a Firestore
// - Seed inicial si la colección está vacía
// - CRUD: crear, actualizar, eliminar tareas
// ============================================================

import { useState, useEffect } from 'react'
import { suscribirTareas, guardarTarea, eliminarTarea, firestoreVacio, seedTareasIniciales } from '../lib/firebase'
import TAREAS_INICIALES from '../data/tareas'

export function useTareas() {
  const [tareas, setTareas]     = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelar = null

    async function inicializar() {
      try {
        // Si Firestore está vacío, subir las tareas iniciales
        const vacio = await firestoreVacio()
        if (vacio) {
          await seedTareasIniciales(TAREAS_INICIALES)
        }

        // Suscripción en tiempo real — se actualiza para todos los usuarios
        cancelar = suscribirTareas((tareasFirestore) => {
          // Ordenar por módulo para consistencia visual
          const ordenadas = [...tareasFirestore].sort((a, b) =>
            a.modulo.localeCompare(b.modulo) || a.id.localeCompare(b.id)
          )
          setTareas(ordenadas)
          setCargando(false)
        })
      } catch (e) {
        console.error("Error conectando con Firebase:", e)
        setError(e.message)
        setCargando(false)
      }
    }

    inicializar()

    // Cleanup: cancela la suscripción al desmontar
    return () => { if (cancelar) cancelar() }
  }, [])

  // Guarda o actualiza una tarea en Firestore
  async function actualizarTarea(tarea) {
    try {
      await guardarTarea(tarea)
    } catch (e) {
      console.error("Error guardando tarea:", e)
    }
  }

  // Elimina una tarea de Firestore
  async function borrarTarea(id) {
    try {
      await eliminarTarea(id)
    } catch (e) {
      console.error("Error eliminando tarea:", e)
    }
  }

  return { tareas, cargando, error, actualizarTarea, borrarTarea }
}
