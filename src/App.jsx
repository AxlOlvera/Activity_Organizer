import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import Loading from './components/Loading'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user)   return <Login />

  return (
    <Routes>
      <Route path="/"        element={<Dashboard />} />
      <Route path="/u/:slug" element={<Dashboard />} />
      <Route path="*"        element={<Navigate to="/" />} />
    </Routes>
  )
}