import { useState, useMemo } from 'react'
import { MODULOS_CONFIG, ESTADO_LABELS, PRIORIDAD_LABELS, TIPO_ICONS } from '../lib/constants'
import ProgressBar from './ProgressBar'
import styles from './ModuleList.module.css'

// ── ModuleList ────────────────────────────────────────────
export default function ModuleList({ tareas, onEditar, onEliminar, onCambiarEstado, onToggleCompletado }) {
  // Agrupar tareas por módulo, preservando el orden de MODULOS_CONFIG
  const grupos = useMemo(() => {
    const map = {}
    tareas.forEach(t => {
      if (!map[t.modulo]) map[t.modulo] = []
      map[t.modulo].push(t)
    })
    // Ordenar según el orden de MODULOS_CONFIG, luego módulos desconocidos al final
    const ordenados = Object.keys(MODULOS_CONFIG).filter(m => map[m])
    const extras = Object.keys(map).filter(m => !MODULOS_CONFIG[m])
    return [...ordenados, ...extras].map(m => ({ modulo: m, tareas: map[m] }))
  }, [tareas])

  if (!tareas.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◈</div>
        <div>No hay tareas que coincidan con los filtros aplicados.</div>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {grupos.map((g, i) => (
        <ModuleCard
          key={g.modulo}
          modulo={g.modulo}
          tareas={g.tareas}
          delay={i * 0.04}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onCambiarEstado={onCambiarEstado}
          onToggleCompletado={onToggleCompletado}
        />
      ))}
    </div>
  )
}

// ── ModuleCard ────────────────────────────────────────────
function ModuleCard({ modulo, tareas, delay, onEditar, onEliminar, onCambiarEstado, onToggleCompletado }) {
  const [abierto, setAbierto] = useState(true)
  const cfg = MODULOS_CONFIG[modulo] || { icono: '📦', dev: '' }

  const completadas = tareas.filter(t => t.estado === 'completado').length
  const pct = tareas.length ? Math.round(completadas / tareas.length * 100) : 0

  return (
    <div className={styles.moduleCard} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.moduleHeader} onClick={() => setAbierto(v => !v)}>
        <span className={styles.moduleIcon}>{cfg.icono}</span>
        <div className={styles.moduleInfo}>
          <div className={styles.moduleName}>{modulo}</div>
          <div className={styles.moduleDev}>{cfg.dev}</div>
        </div>
        <div className={styles.moduleProgress}>
          <ProgressBar value={pct} variant="module" />
          <span className={styles.moduleProgText}>{completadas}/{tareas.length}</span>
        </div>
        <span className={`${styles.toggle} ${abierto ? styles.open : ''}`}>▶</span>
      </div>

      {abierto && (
        <div className={styles.taskList}>
          {tareas.map(t => (
            <TaskCard
              key={t.id}
              tarea={t}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onCambiarEstado={onCambiarEstado}
              onToggleCompletado={onToggleCompletado}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── TaskCard ──────────────────────────────────────────────
function TaskCard({ tarea: t, onEditar, onEliminar, onCambiarEstado, onToggleCompletado }) {
  const [detalleAbierto, setDetalleAbierto] = useState(false)

  return (
    <div className={styles.taskCard}>
      {/* Checkbox */}
      <div
        className={`${styles.check} ${t.estado === 'completado' ? styles.done : ''}`}
        onClick={() => onToggleCompletado(t)}
        title="Marcar como completado"
      >
        {t.estado === 'completado' ? '✓' : ''}
      </div>

      {/* Cuerpo */}
      <div className={styles.taskBody}>
        <div className={styles.taskMeta}>
          <span className={`${styles.tipoBadge} ${styles[t.tipo]}`}>
            {TIPO_ICONS[t.tipo]} {t.tipo}
          </span>
          <span className={`${styles.prioridadBadge} ${styles[t.prioridad]}`}>
            {PRIORIDAD_LABELS[t.prioridad]}
          </span>
        </div>

        <div className={`${styles.taskDesc} ${t.estado === 'completado' ? styles.tachado : ''}`}>
          {t.descripcion}
        </div>

        {/* Detalle expandible */}
        {t.detalle && (
          <div className={styles.detalleWrap}>
            <button
              className={styles.detalleToggle}
              onClick={() => setDetalleAbierto(v => !v)}
            >
              {detalleAbierto ? '▾ Ocultar detalle' : '▸ Ver detalle'}
            </button>
            {detalleAbierto && (
              <div className={styles.detalle}>{t.detalle}</div>
            )}
          </div>
        )}

        {/* Chips */}
        <div className={styles.chipsRow}>
          {t.archivos?.length > 0 && (
            <div className={styles.chipsGroup}>
              <span className={styles.chipsLabel}>Archivos:</span>
              <div className={styles.chips}>
                {t.archivos.map(a => <span key={a} className={`${styles.chip} ${styles.file}`}>{a}</span>)}
              </div>
            </div>
          )}
          {t.paginas?.length > 0 && (
            <div className={styles.chipsGroup}>
              <span className={styles.chipsLabel}>Páginas:</span>
              <div className={styles.chips}>
                {t.paginas.map(p => <span key={p} className={`${styles.chip} ${styles.page}`}>{p}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Footer de la tarea */}
        <div className={styles.taskFooter}>
          <div className={styles.devTag}>
            {t.dev ? <>👤 <span>{t.dev}</span></> : <span style={{color:'var(--text-dim)'}}>Sin asignar</span>}
          </div>
          <span
            className={`${styles.statusBadge} ${styles[t.estado]}`}
            onClick={() => onCambiarEstado(t)}
            title="Click para cambiar estado"
          >
            {ESTADO_LABELS[t.estado]}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className={styles.actions}>
        <button className="btn-icon" onClick={() => onEditar(t)}>Editar</button>
        <button className="btn-icon delete" onClick={() => onEliminar(t.id)}>Eliminar</button>
      </div>
    </div>
  )
}
