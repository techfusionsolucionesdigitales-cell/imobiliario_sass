import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link to="/proyectos" className="font-semibold text-slate-800">
        {usuario?.inmobiliaria?.nombre ?? 'Sistema Inmobiliario'}
      </Link>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span>{usuario?.name}</span>
        <button onClick={onLogout} className="text-indigo-600 font-medium hover:underline">
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
