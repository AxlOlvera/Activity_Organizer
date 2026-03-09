// ProgressBar.jsx
import styles from './ProgressBar.module.css'

export default function ProgressBar({ value, variant = 'global' }) {
  return (
    <div className={styles.track}>
      <div
        className={`${styles.fill} ${styles[variant]}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
