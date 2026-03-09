import styles from './Modal.module.css'

export default function ConfirmModal({ onConfirmar, onCancelar }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className={styles.modal} style={{ maxWidth: '380px' }}>
        <div className={styles.header}>
          <h2>Eliminar Tarea</h2>
          <button className={styles.close} onClick={onCancelar}>✕</button>
        </div>
        <div className={styles.body}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            ¿Estás seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer y se eliminará para todos.
          </p>
        </div>
        <div className={styles.footer}>
          <button className="btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button className="btn-danger" onClick={onConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
