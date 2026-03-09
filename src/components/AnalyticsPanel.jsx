import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'
import { MODULOS_CONFIG, INTEGRANTES } from '../lib/constants'
import styles from './AnalyticsPanel.module.css'

const COLORS = {
  completado:   '#4ecb8d',
  'en-progreso':'#f0c040',
  pendiente:    '#555e7a',
  critica:      '#e85a5a',
  importante:   '#f0c040',
  mejora:       '#4ecb8d',
}

// Tooltip personalizado oscuro
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1e28', border: '1px solid #2e3548',
      borderRadius: 6, padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11,
    }}>
      {label && <div style={{ color: '#6b7394', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#e8eaf2' }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPanel({ tareas }) {
  // ── Datos calculados ────────────────────────────────────

  // 1. Progreso por módulo
  const porModulo = useMemo(() => {
    return Object.keys(MODULOS_CONFIG).map(m => {
      const t = tareas.filter(x => x.modulo === m)
      const completadas = t.filter(x => x.estado === 'completado').length
      return {
        name: m.length > 18 ? m.slice(0, 16) + '…' : m,
        fullName: m,
        total: t.length,
        completadas,
        pendientes: t.filter(x => x.estado === 'pendiente').length,
        enProgreso: t.filter(x => x.estado === 'en-progreso').length,
        pct: t.length ? Math.round(completadas / t.length * 100) : 0,
      }
    }).filter(m => m.total > 0)
  }, [tareas])

  // 2. Distribución de estados (pie)
  const porEstado = useMemo(() => {
    const counts = { pendiente: 0, 'en-progreso': 0, completado: 0 }
    tareas.forEach(t => { if (counts[t.estado] !== undefined) counts[t.estado]++ })
    return [
      { name: 'Pendiente',   value: counts.pendiente,    fill: COLORS.pendiente },
      { name: 'En Progreso', value: counts['en-progreso'], fill: COLORS['en-progreso'] },
      { name: 'Completado',  value: counts.completado,   fill: COLORS.completado },
    ].filter(d => d.value > 0)
  }, [tareas])

  // 3. Tareas por persona
  const porPersona = useMemo(() => {
    return INTEGRANTES.map(nombre => {
      const mis = tareas.filter(t => t.dev === nombre)
      const done = mis.filter(t => t.estado === 'completado').length
      return {
        name: nombre.split(' ').slice(0, 2).join(' '),
        total: mis.length,
        completadas: done,
        pct: mis.length ? Math.round(done / mis.length * 100) : 0,
      }
    }).filter(p => p.total > 0).sort((a, b) => b.total - a.total)
  }, [tareas])

  // 4. Distribución de prioridades (pie)
  const porPrioridad = useMemo(() => {
    const counts = { critica: 0, importante: 0, mejora: 0 }
    tareas.forEach(t => { if (counts[t.prioridad] !== undefined) counts[t.prioridad]++ })
    return [
      { name: '🔥 Crítica',    value: counts.critica,    fill: COLORS.critica },
      { name: '🛠️ Importante', value: counts.importante, fill: COLORS.importante },
      { name: '🌟 Mejora',     value: counts.mejora,     fill: COLORS.mejora },
    ].filter(d => d.value > 0)
  }, [tareas])

  // 5. Stats globales
  const stats = useMemo(() => {
    const total      = tareas.length
    const completado = tareas.filter(t => t.estado === 'completado').length
    const enProgreso = tareas.filter(t => t.estado === 'en-progreso').length
    const criticas   = tareas.filter(t => t.prioridad === 'critica' && t.estado !== 'completado').length
    const pct        = total ? Math.round(completado / total * 100) : 0
    return { total, completado, enProgreso, criticas, pct }
  }, [tareas])

  return (
    <div className={styles.panel}>

      {/* ── KPIs ── */}
      <div className={styles.kpis}>
        <KPI label="Progreso Total"   value={`${stats.pct}%`}           sub={`${stats.completado}/${stats.total} tareas`} color="var(--accent)" />
        <KPI label="En Progreso"      value={stats.enProgreso}           sub="tareas activas"                              color="var(--yellow)" />
        <KPI label="Críticas Abiertas" value={stats.criticas}            sub="requieren atención"                          color="var(--fix)" />
        <KPI label="Completadas"      value={stats.completado}           sub="tareas finalizadas"                          color="var(--green)" />
      </div>

      {/* ── Gráficos fila 1 ── */}
      <div className={styles.row2}>
        <ChartCard title="Progreso por Módulo" sub="completadas vs total">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porModulo} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#3f4663', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6b7394', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="completadas" name="Completadas" fill="#4ecb8d" radius={[0,3,3,0]} barSize={10} />
              <Bar dataKey="pendientes"  name="Pendientes"  fill="#2e3548"  radius={[0,3,3,0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución de Estados" sub="todas las tareas">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={porEstado} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                   dataKey="value" nameKey="name" paddingAngle={3}>
                {porEstado.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
              <Legend
                formatter={v => <span style={{ color: '#6b7394', fontSize: 11 }}>{v}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Gráficos fila 2 ── */}
      <div className={styles.row2}>
        <ChartCard title="Carga por Integrante" sub="tareas asignadas">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porPersona} margin={{ left: 0, right: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#6b7394', fontSize: 9 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={45} />
              <YAxis tick={{ fill: '#3f4663', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="completadas" name="Completadas" stackId="a" fill="#4ecb8d" radius={[0,0,0,0]} />
              <Bar dataKey="total"       name="Total"       stackId="b" fill="#2e3548"  radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución de Prioridades" sub="tareas pendientes y en progreso">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={porPrioridad} cx="50%" cy="50%" outerRadius={95}
                   dataKey="value" nameKey="name" paddingAngle={3}>
                {porPrioridad.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
              <Legend
                formatter={v => <span style={{ color: '#6b7394', fontSize: 11 }}>{v}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Tabla de progreso por módulo ── */}
      <ChartCard title="Resumen por Módulo" sub="estado detallado">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Total</th>
              <th>✓ Completadas</th>
              <th>⟳ En Progreso</th>
              <th>○ Pendientes</th>
              <th>Progreso</th>
            </tr>
          </thead>
          <tbody>
            {porModulo.map(m => (
              <tr key={m.fullName}>
                <td>{MODULOS_CONFIG[m.fullName]?.icono} {m.fullName}</td>
                <td>{m.total}</td>
                <td style={{ color: 'var(--green)' }}>{m.completadas}</td>
                <td style={{ color: 'var(--yellow)' }}>{m.enProgreso}</td>
                <td style={{ color: 'var(--gray)' }}>{m.pendientes}</td>
                <td>
                  <div className={styles.miniBar}>
                    <div className={styles.miniBarFill} style={{ width: `${m.pct}%` }} />
                    <span>{m.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartCard>

    </div>
  )
}

// Helpers
function KPI({ label, value, sub, color }) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiValue} style={{ color }}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiSub}>{sub}</div>
    </div>
  )
}

function ChartCard({ title, sub, children }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>{title}</div>
        {sub && <div className={styles.chartSub}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}
