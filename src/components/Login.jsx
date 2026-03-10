import useAuth from '../hooks/useAuth'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>◈</div>
        <h1 className={styles.title}>ROADMAP</h1>
        <p className={styles.sub}>Tienda Artesanías</p>
        <button className={styles.btn} onClick={login}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
          />
          Continuar con Google
        </button>
      </div>
    </div>
  )
}