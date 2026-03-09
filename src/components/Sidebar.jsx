import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MODULOS_CONFIG, INTEGRANTES, nombreASlug } from '../lib/constants'
import ProgressBar from './ProgressBar'
import styles from './Sidebar.module.css'

const PAGINAS = [
  'index.html','products.html','cart.html',
  'contact.html','product-detail.html','users.html','login.html'
]

export default function Sidebar({
  tareas, filtroModulo, filtroPagina, filtroEstado,
  panelActivo, personaFiltro,
  onModulo, onPagina, onEstado, onPanel, onNuevaTarea
}) {
  const { completadas, total, pct } = useMemo(() => {
    const completadas = tareas.filter(t => t.estado === 'completado').length
    const total = tareas.length
    return { completadas, total, pct: total ? Math.round(completadas / total * 100) : 0 }
  }, [tareas])

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <div>
            <div className={styles.logoTitle}>ROADMAP</div>
            <div className={styles.logoSub}>Tienda Artesanías</div>
          </div>
        </div>
      </div>

      {/* Progreso global */}
      <div className={styles.progressBox}>
        <div className={styles.progressLabel}>
          <span>Progreso Global</span>
          <span className={styles.pct}>{pct}%</span>
        </div>
        <ProgressBar value={pct} />
        <div className={styles.progressCounts}>{completadas} / {total} tareas completadas</div>
      </div>

      {/* Vista */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>VISTA</div>
        <div className={styles.btnGroup}>
          <button
            className={`${styles.viewBtn} ${panelActivo === 'tareas' ? styles.active : ''}`}
            onClick={() => onPanel('tareas')}
          >📋 Tareas</button>
          <button
            className={`${styles.viewBtn} ${panelActivo === 'analytics' ? styles.active : ''}`}
            onClick={() => onPanel('analytics')}
          >📊 Analytics</button>
        </div>
      </div>

      {/* Filtro por estado */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>ESTADO</div>
        {['all','pendiente','en-progreso','completado'].map(e => (
          <button
            key={e}
            className={`${styles.filterBtn} ${filtroEstado === e ? styles.active : ''}`}
            onClick={() => onEstado(e)}
          >
            {e === 'all' ? 'Todos' : e === 'en-progreso' ? 'En Progreso' : e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
      </div>

      {/* Filtro por página */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>PÁGINA</div>
        <button
          className={`${styles.filterBtn} ${filtroPagina === 'all' ? styles.active : ''}`}
          onClick={() => onPagina('all')}
        >Todas</button>
        {PAGINAS.map(p => (
          <button
            key={p}
            className={`${styles.filterBtn} ${filtroPagina === p ? styles.active : ''}`}
            onClick={() => onPagina(p)}
          >{p}</button>
        ))}
      </div>

      {/* Módulos */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>MÓDULOS</div>
        <button
          className={`${styles.moduleBtn} ${filtroModulo === 'all' ? styles.active : ''}`}
          onClick={() => onModulo('all')}
        >
          <span>◈</span>
          <span className={styles.modName}>Todos</span>
          <span className={styles.modCount}>{tareas.length}</span>
        </button>
        {Object.entries(MODULOS_CONFIG).map(([nombre, cfg]) => {
          const n = tareas.filter(t => t.modulo === nombre).length
          return (
            <button
              key={nombre}
              className={`${styles.moduleBtn} ${filtroModulo === nombre ? styles.active : ''}`}
              onClick={() => onModulo(nombre)}
            >
              <span>{cfg.icono}</span>
              <span className={styles.modName}>{nombre}</span>
              <span className={styles.modCount}>{n}</span>
            </button>
          )
        })}
      </div>

      {/* Links personales */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          MI VISTA
          {personaFiltro && (
            <Link to="/" className={styles.resetBtn} title="Ver todas las tareas">
              ✕ Reset
            </Link>
          )}
        </div>
        <div className={styles.integrantes}>
          {INTEGRANTES.map(nombre => {
            const slug = nombreASlug(nombre)
            const primerosDos = nombre.split(' ').slice(0, 2).join(' ')
            const activo = personaFiltro === nombre
            return (
              <Link
                key={nombre}
                to={`/u/${slug}`}
                className={`${styles.integranteLink} ${activo ? styles.active : ''}`}
                title={nombre}
              >
                👤 {primerosDos}
              </Link>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <button className="btn-primary" onClick={onNuevaTarea}>+ Nueva Tarea</button>
      </div>
    </aside>
  )
}
