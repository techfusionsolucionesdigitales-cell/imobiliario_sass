import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../api/client'
import type { Inmobiliaria } from '../api/types'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function InmobiliariaSettingsPage() {
  const { usuario } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Inmobiliaria>('/inmobiliaria').then((res) => {
      setForm({
        nombre: res.data.nombre,
        email: res.data.email ?? '',
        telefono: res.data.telefono ?? '',
      })
      setCargando(false)
    })
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setGuardado(false)
    setGuardando(true)
    try {
      await api.put('/inmobiliaria', form)
      setGuardado(true)
    } catch {
      setError('No se pudo guardar. Revisa los datos.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-1">Mi inmobiliaria</h1>
        <p className="text-sm text-slate-500 mb-6">
          Slug interno: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{usuario?.inmobiliaria?.slug}</code>
        </p>

        {cargando ? (
          <p className="text-slate-500">Cargando...</p>
        ) : (
          <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre comercial</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo de contacto</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {guardado && <p className="text-sm text-emerald-600">Guardado correctamente.</p>}

            <button
              type="submit"
              disabled={guardando}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
