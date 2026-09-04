import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import InicioPage from './pages/InicioPage'
import ProyectosPage from './pages/ProyectosPage'
import ProyectoDetailPage from './pages/ProyectoDetailPage'
import MapaPage from './pages/MapaPage'
import InmobiliariaSettingsPage from './pages/InmobiliariaSettingsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <InicioPage />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/inmobiliaria"
        element={
          <ProtectedRoute>
            <InmobiliariaSettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
