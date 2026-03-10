import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import { useTareas } from './hooks/useTareas'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import Loading from './components/Loading'

function DashboardWrapper({ actualizarTarea, borrarTarea, tareas }) {
  return <Dashboard tareas={tareas} actualizarTarea={actualizarTarea} borrarTarea={borrarTarea} />
}

function AppAutenticada() {
  const { tareas, cargando, error, actualizarTarea, borrarTarea } = useTareas()

  if (cargando) return <Loading />
  if (error) return <div style={{color:'red', padding:'2rem'}}>Error: {error}</div>

  return (
    <Routes>
      <Route path="/"        element={<Dashboard tareas={tareas} actualizarTarea={actualizarTarea} borrarTarea={borrarTarea} />} />
      <Route path="/u/:slug" element={<Dashboard tareas={tareas} actualizarTarea={actualizarTarea} borrarTarea={borrarTarea} />} />
      <Route path="*"        element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user)   return <Login />

  return <AppAutenticada />
}