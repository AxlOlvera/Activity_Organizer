import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { slugANombre, MODULOS_CONFIG, nombreASlug } from '../lib/constants'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import ModuleList from '../components/ModuleList'
import TaskModal from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'
import AnalyticsPanel from '../components/AnalyticsPanel'
import styles from './Dashboard.module.css'

export default function Dashboard({ tareas, actualizarTarea, borrarTarea }) {
  const { slug } = useParams()

  // Si hay slug en la URL, pre-filtrar por esa persona
  const personaFiltro = slug ? slugANombre(slug) : null

  const [filtroModulo,  setFiltroModulo]  = useState('all')
  const [filtroPagina,  setFiltroPagina]  = useState('all')
  const [filtroEstado,  setFiltroEstado]  = useState('all')
  const [busqueda,      setBusqueda]      = useState('')
  const [panelActivo,   setPanelActivo]   = useState('tareas') // 'tareas' | 'analytics'

  // Modal de tarea (crear/editar)
  const [modalAbierto,  setModalAbierto]  = useState(false)
  const [tareaEditando, setTareaEditando] = useState(null)

  // Modal de confirmación de borrado
  const [confirmId, setConfirmId] = useState(null)

  // ── Filtrado ─────────────────────────────────────────────
  const tareasFiltradas = useMemo(() => {
    return tareas.filter(t => {
      if (filtroModulo !== 'all' && t.modulo !== filtroModulo) return false
      if (filtroPagina !== 'all' && !t.paginas?.includes(filtroPagina)) return false
      if (filtroEstado !== 'all' && t.estado !== filtroEstado) return false
      if (personaFiltro && t.dev !== personaFiltro) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        const hit = t.descripcion?.toLowerCase().includes(q)
          || t.archivos?.some(a => a.toLowerCase().includes(q))
          || t.dev?.toLowerCase().includes(q)
          || t.modulo?.toLowerCase().includes(q)
        if (!hit) return false
      }
      return true
    })
  }, [tareas, filtroModulo, filtroPagina, filtroEstado, busqueda, personaFiltro])

  // ── Handlers ─────────────────────────────────────────────
  function abrirNueva() {
    setTareaEditando(null)
    setModalAbierto(true)
  }

  function abrirEditar(tarea) {
    setTareaEditando(tarea)
    setModalAbierto(true)
  }

  async function handleGuardar(tarea) {
    await actualizarTarea(tarea)
    setModalAbierto(false)
  }

  async function handleCambiarEstado(tarea) {
    const ciclo = ['pendiente', 'en-progreso', 'completado']
    const idx   = ciclo.indexOf(tarea.estado)
    await actualizarTarea({ ...tarea, estado: ciclo[(idx + 1) % ciclo.length] })
  }

  async function handleToggleCompletado(tarea) {
    await actualizarTarea({
      ...tarea,
      estado: tarea.estado === 'completado' ? 'pendiente' : 'completado'
    })
  }

  async function handleConfirmDelete() {
    if (confirmId) {
      await borrarTarea(confirmId)
      setConfirmId(null)
    }
  }

  const titulo = personaFiltro
    ? personaFiltro.split(' ').slice(0, 2).join(' ')
    : filtroModulo !== 'all' ? filtroModulo : 'Todas las Tareas'

  return (
    <div className={styles.layout}>
      <Sidebar
        tareas={tareas}
        filtroModulo={filtroModulo}
        filtroPagina={filtroPagina}
        filtroEstado={filtroEstado}
        panelActivo={panelActivo}
        personaFiltro={personaFiltro}
        onModulo={setFiltroModulo}
        onPagina={setFiltroPagina}
        onEstado={setFiltroEstado}
        onPanel={setPanelActivo}
        onNuevaTarea={abrirNueva}
      />

      <main className={styles.main}>
        <TopBar
          titulo={titulo}
          total={tareasFiltradas.length}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          personaFiltro={personaFiltro}
        />

        <div className={styles.content}>
          {panelActivo === 'tareas' ? (
            <ModuleList
              tareas={tareasFiltradas}
              onEditar={abrirEditar}
              onEliminar={id => setConfirmId(id)}
              onCambiarEstado={handleCambiarEstado}
              onToggleCompletado={handleToggleCompletado}
            />
          ) : (
            <AnalyticsPanel tareas={tareas} />
          )}
        </div>
      </main>

      {modalAbierto && (
        <TaskModal
          tareaInicial={tareaEditando}
          onGuardar={handleGuardar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      {confirmId && (
        <ConfirmModal
          onConfirmar={handleConfirmDelete}
          onCancelar={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
