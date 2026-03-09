import { useState } from 'react'
import { MODULOS_CONFIG, INTEGRANTES, generarId } from '../lib/constants'
import styles from './Modal.module.css'

export default function TaskModal({ tareaInicial, onGuardar, onCerrar }) {
  const es = !!tareaInicial

  const [form, setForm] = useState({
    id:          tareaInicial?.id          ?? generarId(),
    modulo:      tareaInicial?.modulo      ?? Object.keys(MODULOS_CONFIG)[0],
    tipo:        tareaInicial?.tipo        ?? 'fix',
    descripcion: tareaInicial?.descripcion ?? '',
    detalle:     tareaInicial?.detalle     ?? '',
    archivos:    tareaInicial?.archivos?.join(', ') ?? '',
    paginas:     tareaInicial?.paginas?.join(', ')  ?? '',
    prioridad:   tareaInicial?.prioridad   ?? 'critica',
    estado:      tareaInicial?.estado      ?? 'pendiente',
    dev:         tareaInicial?.dev         ?? '',
  })

  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleGuardar() {
    if (!form.descripcion.trim()) {
      setError('La descripción es requerida.')
      return
    }
    await onGuardar({
      id:          form.id,
      modulo:      form.modulo,
      tipo:        form.tipo,
      descripcion: form.descripcion.trim(),
      detalle:     form.detalle.trim(),
      archivos:    form.archivos.split(',').map(s => s.trim()).filter(Boolean),
      paginas:     form.paginas.split(',').map(s => s.trim()).filter(Boolean),
      prioridad:   form.prioridad,
      estado:      form.estado,
      dev:         form.dev,
    })
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCerrar()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{es ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button className={styles.close} onClick={onCerrar}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.row2}>
            <Field label="Módulo">
              <select value={form.modulo} onChange={e => set('modulo', e.target.value)}>
                {Object.keys(MODULOS_CONFIG).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option value="fix">⚙️ fix</option>
                <option value="feat">✨ feat</option>
                <option value="upgrade">🚀 upgrade</option>
              </select>
            </Field>
          </div>

          <Field label="Descripción breve">
            <input
              value={form.descripcion}
              onChange={e => { set('descripcion', e.target.value); setError('') }}
              placeholder="Describe la tarea en una línea..."
              onKeyDown={e => e.key === 'Enter' && handleGuardar()}
            />
            {error && <span className={styles.error}>{error}</span>}
          </Field>

          <Field label="Detalle" hint="instrucciones paso a paso para el desarrollador">
            <textarea
              value={form.detalle}
              onChange={e => set('detalle', e.target.value)}
              placeholder="Explica qué hacer exactamente, qué archivos tocar, qué probar..."
              rows={4}
            />
          </Field>

          <Field label="Archivos afectados" hint="separados por coma">
            <input
              value={form.archivos}
              onChange={e => set('archivos', e.target.value)}
              placeholder="navbar.css, main.js, index.html"
            />
          </Field>

          <Field label="Páginas afectadas" hint="separadas por coma">
            <input
              value={form.paginas}
              onChange={e => set('paginas', e.target.value)}
              placeholder="index.html, products.html"
            />
          </Field>

          <div className={styles.row2}>
            <Field label="Prioridad">
              <select value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
                <option value="critica">🔥 Crítica</option>
                <option value="importante">🛠️ Importante</option>
                <option value="mejora">🌟 Mejora</option>
              </select>
            </Field>
            <Field label="Asignado a">
              <select value={form.dev} onChange={e => set('dev', e.target.value)}>
                <option value="">Sin asignar</option>
                {INTEGRANTES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Estado">
            <div className={styles.radioGroup}>
              {[['pendiente','Pendiente'],['en-progreso','En Progreso'],['completado','Completado']].map(([v,l]) => (
                <label key={v} className={`${styles.radio} ${form.estado === v ? styles[v] : ''}`}>
                  <input
                    type="radio"
                    name="estado"
                    value={v}
                    checked={form.estado === v}
                    onChange={() => set('estado', v)}
                    style={{ display: 'none' }}
                  />
                  {l}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div className={styles.footer}>
          <button className="btn-ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={handleGuardar}>
            {es ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label} {hint && <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'none', fontWeight: 400 }}>({hint})</span>}
      </label>
      {children}
    </div>
  )
}
