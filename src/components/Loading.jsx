// Loading.jsx
export function Loading() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100vh', gap: '16px',
      background: 'var(--bg)', color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ fontSize: '32px', animation: 'spin 1.2s linear infinite' }}>◈</div>
      <div style={{ fontSize: '12px', letterSpacing: '2px' }}>CONECTANDO CON FIREBASE...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ErrorScreen.jsx
export function ErrorScreen({ mensaje }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100vh', gap: '12px',
      background: 'var(--bg)', color: 'var(--fix)',
      fontFamily: 'var(--font-mono)', padding: '40px', textAlign: 'center'
    }}>
      <div style={{ fontSize: '28px' }}>⚠️</div>
      <div style={{ fontSize: '14px', fontWeight: 600 }}>Error conectando con Firebase</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '400px' }}>
        {mensaje}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
        Revisa que tu firebaseConfig en <code>src/lib/firebase.js</code> sea correcto.
      </div>
    </div>
  )
}

export default Loading
