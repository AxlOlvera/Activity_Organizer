// TopBar.jsx
import styles from './TopBar.module.css'

export default function TopBar({ titulo, total, busqueda, onBusqueda, personaFiltro }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>{titulo}</h1>
        <span className={styles.badge}>{total}</span>
        {personaFiltro && (
          <span className={styles.personalTag}>vista personal</span>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            value={busqueda}
            onChange={e => onBusqueda(e.target.value)}
            placeholder="Buscar tarea, archivo, persona..."
          />
        </div>
      </div>
    </header>
  )
}
