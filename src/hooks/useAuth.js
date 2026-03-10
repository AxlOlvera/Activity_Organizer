import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export default function useAuth() {
  const [user, setUser]       = useState(undefined) // undefined = cargando
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login  = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  return { user, loading, login, logout }
}