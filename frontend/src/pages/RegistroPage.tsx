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
      navigate('/proyectos')
    } catch {
      setError('No se pudo completar el registro. Revisa los datos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800">Registrar inmobiliaria</h1>

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
  )
}
