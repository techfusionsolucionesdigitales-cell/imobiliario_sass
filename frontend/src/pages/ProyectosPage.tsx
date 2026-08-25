import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Proyecto } from '../api/types'
import Navbar from '../components/Navbar'

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  function cargarProyectos() {
    api.get<Proyecto[]>('/proyectos').then((res) => setProyectos(res.data))
  }

  useEffect(() => {
    cargarProyectos()
    setCargando(false)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Proyectos / Urbanizaciones</h1>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo proyecto'}
          </button>
        </div>

        {mostrarForm && (
          <NuevoProyectoForm
            onCreado={() => {
              setMostrarForm(false)
              cargarProyectos()
            }}
          />
        )}

        {cargando ? (
          <p className="text-slate-500">Cargando...</p>
        ) : proyectos.length === 0 ? (
          <p className="text-slate-500">Aún no hay proyectos. Crea el primero.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proyectos.map((p) => (
              <Link
                key={p.id}
                to={`/proyectos/${p.id}`}
                className="bg-white rounded-xl shadow p-5 hover:shadow-md transition"
              >
                <h2 className="font-semibold text-slate-800">{p.nombre}</h2>
                <p className="text-sm text-slate-500 mt-1">{p.ubicacion ?? 'Sin ubicación'}</p>
                <p className="text-xs text-slate-400 mt-3">{p.planos_count ?? 0} plano(s)</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function NuevoProyectoForm({ onCreado }: { onCreado: () => void }) {
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    lat_centro: '',
    lng_centro: '',
    descripcion: '',
  })
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/proyectos', {
        ...form,
        lat_centro: Number(form.lat_centro),
        lng_centro: Number(form.lng_centro),
      })
      onCreado()
    } catch {
      setError('No se pudo crear el proyecto. Revisa los campos.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-5 mb-6 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          placeholder="Nombre del proyecto"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Latitud centro (ej. -12.0470)"
          required
          value={form.lat_centro}
          onChange={(e) => setForm({ ...form, lat_centro: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Longitud centro (ej. -77.0430)"
          required
          value={form.lng_centro}
          onChange={(e) => setForm({ ...form, lng_centro: e.target.value })}
          className="border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>
      <textarea
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Guardar proyecto
      </button>
    </form>
  )
}
