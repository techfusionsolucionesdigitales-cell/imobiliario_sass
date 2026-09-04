import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const rolEtiqueta: Record<string, string> = {
  admin_inmobiliaria: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}

const enlaces = [
  { to: '/proyectos', label: 'Proyectos', icon: '📐' },
  { to: '/inmobiliaria', label: 'Mi inmobiliaria', icon: '🏢' },
]

export default function Navbar() {
  const { usuario, roles, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate('/login')
  }

  const rolPrincipal = roles[0] ? (rolEtiqueta[roles[0]] ?? roles[0]) : null

  return (
    <header className="bg-slate-900 text-slate-100 select-none">
      <div className="px-4 flex items-center h-12">
        <div className="flex items-center gap-2 pr-4 mr-4 border-r border-slate-700 shrink-0">
          <span className="text-lg">🏘️</span>
          <span className="font-semibold text-sm text-white truncate max-w-45">
            {usuario?.inmobiliaria?.nombre ?? 'Sistema Inmobiliario'}
          </span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 h-12 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-400 text-white'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                }`
              }
            >
              <span>{enlace.icon}</span>
              {enlace.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 pl-4 shrink-0">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-white">{usuario?.name}</p>
            {rolPrincipal && <p className="text-xs text-slate-400">{rolPrincipal}</p>}
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md px-3 py-1.5 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
