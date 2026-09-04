import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await login(username, password)
      navigate('/proyectos')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-slate-300">
        <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 text-sm font-medium text-slate-300">Sistema Inmobiliario Digital</span>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 space-y-4">
          <div className="text-center pb-2">
            <div className="text-3xl mb-1">🏘️</div>
            <h1 className="text-xl font-semibold text-slate-800">Iniciar sesión</h1>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoCapitalize="none"
              autoComplete="username"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-sm text-center text-slate-500">
            ¿Nueva inmobiliaria?{' '}
            <Link to="/registro" className="text-indigo-600 font-medium">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
