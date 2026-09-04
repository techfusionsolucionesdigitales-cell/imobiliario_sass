import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Plano, Proyecto } from '../api/types'
import Navbar from '../components/Navbar'

export default function ProyectoDetailPage() {
  const { id } = useParams()
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [planos, setPlanos] = useState<Plano[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  function cargar() {
    api.get<Proyecto>(`/proyectos/${id}`).then((res) => setProyecto(res.data))
    api.get<Plano[]>(`/proyectos/${id}/planos`).then((res) => setPlanos(res.data))
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-[1600px] mx-auto p-10">
        <Link to="/proyectos" className="text-base text-indigo-600">
          ← Proyectos
        </Link>
        <div className="flex items-center justify-between mt-3 mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">{proyecto?.nombre ?? 'Cargando...'}</h1>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-base font-medium hover:bg-indigo-700"
          >
            {mostrarForm ? 'Cancelar' : '+ Subir plano'}
          </button>
        </div>

        {mostrarForm && proyecto && (
          <NuevoPlanoForm
            proyecto={proyecto}
            onCreado={() => {
              setMostrarForm(false)
              cargar()
            }}
          />
        )}

        {planos.length === 0 ? (
          <p className="text-slate-500">Aún no hay planos digitalizados para este proyecto.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {planos.map((p) => (
              <Link
                key={p.id}
                to={`/planos/${p.id}`}
                className="bg-white rounded-2xl shadow-md p-7 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <h2 className="text-lg font-semibold text-slate-800">{p.nombre}</h2>
                <p className="text-sm text-slate-400 mt-4">{p.lotes_count ?? 0} lote(s)</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function NuevoPlanoForm({ proyecto, onCreado }: { proyecto: Proyecto; onCreado: () => void }) {
  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [bounds, setBounds] = useState({
    bounds_norte: String(proyecto.lat_centro + 0.003),
    bounds_sur: String(proyecto.lat_centro - 0.003),
    bounds_este: String(proyecto.lng_centro + 0.003),
    bounds_oeste: String(proyecto.lng_centro - 0.003),
  })
  const [error, setError] = useState<string | null>(null)
  const [subiendo, setSubiendo] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!imagen) {
      setError('Selecciona la imagen del plano')
      return
    }
    setError(null)
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('imagen', imagen)
      Object.entries(bounds).forEach(([k, v]) => formData.append(k, v))

      await api.post(`/proyectos/${proyecto.id}/planos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onCreado()
    } catch {
      setError('No se pudo subir el plano.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-md p-7 mb-8 space-y-4">
      <input
        placeholder="Nombre del plano (ej. Plano General, Etapa 1...)"
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-base"
      />
      <input
        type="file"
        accept="image/*"
        required
        onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
        className="w-full text-base"
      />
      <p className="text-sm text-slate-500">
        Límites geográficos donde se superpone la imagen sobre el mapa (ajustables luego visualmente):
      </p>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Norte"
          value={bounds.bounds_norte}
          onChange={(e) => setBounds({ ...bounds, bounds_norte: e.target.value })}
          className="border border-slate-300 rounded-lg px-4 py-2.5 text-base"
        />
        <input
          placeholder="Sur"
          value={bounds.bounds_sur}
          onChange={(e) => setBounds({ ...bounds, bounds_sur: e.target.value })}
          className="border border-slate-300 rounded-lg px-4 py-2.5 text-base"
        />
        <input
          placeholder="Este"
          value={bounds.bounds_este}
          onChange={(e) => setBounds({ ...bounds, bounds_este: e.target.value })}
          className="border border-slate-300 rounded-lg px-4 py-2.5 text-base"
        />
        <input
          placeholder="Oeste"
          value={bounds.bounds_oeste}
          onChange={(e) => setBounds({ ...bounds, bounds_oeste: e.target.value })}
          className="border border-slate-300 rounded-lg px-4 py-2.5 text-base"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={subiendo}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-base font-medium disabled:opacity-50"
      >
        {subiendo ? 'Subiendo...' : 'Guardar plano'}
      </button>
    </form>
  )
}
