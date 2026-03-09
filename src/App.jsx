import { Routes, Route } from 'react-router-dom'
import { useTareas } from './hooks/useTareas'
import Dashboard from './pages/Dashboard'
import Loading from './components/Loading'
import ErrorScreen from './components/ErrorScreen'

export default function App() {
  const { tareas, cargando, error, actualizarTarea, borrarTarea } = useTareas()

  if (cargando) return <Loading />
  if (error)    return <ErrorScreen mensaje={error} />

  const props = { tareas, actualizarTarea, borrarTarea }

  return (
    <Routes>
      {/* Vista completa — todos los módulos y tareas */}
      <Route path="/" element={<Dashboard {...props} />} />

      {/* Vista personal — filtrada por integrante 
          Ej: /u/isaac-lopez-carmona  */}
      <Route path="/u/:slug" element={<Dashboard {...props} />} />

      {/* Cualquier ruta desconocida → home */}
      <Route path="*" element={<Dashboard {...props} />} />
    </Routes>
  )
}
