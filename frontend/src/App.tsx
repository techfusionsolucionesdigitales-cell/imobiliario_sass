import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import ProyectosPage from './pages/ProyectosPage'
import ProyectoDetailPage from './pages/ProyectoDetailPage'
import MapaPage from './pages/MapaPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/proyectos" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route
        path="/proyectos"
        element={
          <ProtectedRoute>
            <ProyectosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proyectos/:id"
        element={
          <ProtectedRoute>
            <ProyectoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planos/:id"
        element={
          <ProtectedRoute>
            <MapaPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
