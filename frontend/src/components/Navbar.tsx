import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const rolEtiqueta: Record<string, string> = {
  admin_inmobiliaria: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}

const enlaces = [
  { to: '/', label: 'Inicio', icon: '🏠', fin: true },
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
      <div className="px-6 flex items-center h-16">
        <div className="flex items-center gap-2.5 pr-5 mr-5 border-r border-slate-700 shrink-0">
          <span className="text-2xl">🏘️</span>
          <span className="font-semibold text-base text-white truncate max-w-56">
            {usuario?.inmobiliaria?.nombre ?? 'Sistema Inmobiliario'}
          </span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.fin}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 h-16 text-base font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-400 text-white'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                }`
              }
            >
              <span className="text-lg">{enlace.icon}</span>
              {enlace.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 pl-5 shrink-0">
          <div className="text-right leading-tight">
            <p className="text-base font-medium text-white">{usuario?.name}</p>
            {rolPrincipal && <p className="text-sm text-slate-400">{rolPrincipal}</p>}
          </div>
          <button
            onClick={onLogout}
            className="text-base text-slate-300 hover:text-white hover:bg-slate-800 rounded-md px-4 py-2 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
