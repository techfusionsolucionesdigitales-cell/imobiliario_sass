import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegistroPage() {
  const { registrarInmobiliaria } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    inmobiliaria_nombre: '',
    admin_name: '',
    admin_username: '',
    admin_password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await registrarInmobiliaria(form)
      navigate('/')
    } catch {
      setError('No se pudo completar el registro. Revisa los datos.')
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
        <h1 className="text-xl font-semibold text-slate-800 text-center pb-2">Registrar inmobiliaria</h1>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la inmobiliaria</label>
          <input
            value={form.inmobiliaria_nombre}
            onChange={(e) => set('inmobiliaria_nombre', e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tu nombre</label>
          <input
            value={form.admin_name}
            onChange={(e) => set('admin_name', e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
          <input
            type="text"
            value={form.admin_username}
            onChange={(e) => set('admin_username', e.target.value)}
            required
            autoCapitalize="none"
            pattern="[A-Za-z0-9_-]+"
            title="Solo letras, números, guiones y guion bajo"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            minLength={8}
            value={form.admin_password}
            onChange={(e) => set('admin_password', e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {cargando ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="text-sm text-center text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-600 font-medium">
            Inicia sesión
          </Link>
        </p>
        </form>
      </div>
    </div>
  )
}
