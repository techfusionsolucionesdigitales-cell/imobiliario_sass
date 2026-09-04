import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Proyecto } from '../api/types'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

interface Modulo {
  to: string
  icon: string
  titulo: string
  descripcion: string
  contador?: string
}

export default function InicioPage() {
  const { usuario } = useAuth()
  const [totalProyectos, setTotalProyectos] = useState<number | null>(null)
  const [totalPlanos, setTotalPlanos] = useState<number | null>(null)

  useEffect(() => {
    api.get<Proyecto[]>('/proyectos').then((res) => {
      setTotalProyectos(res.data.length)
      const planos = res.data.reduce((acc, p) => acc + (p.planos_count ?? 0), 0)
      setTotalPlanos(planos)
    })
  }, [])

  const modulos: Modulo[] = [
    {
      to: '/proyectos',
      icon: '📐',
      titulo: 'Proyectos',
      descripcion: 'Urbanizaciones y lotizaciones: planos digitalizados y lotes.',
      contador: totalProyectos !== null ? `${totalProyectos} proyecto(s)` : undefined,
    },
    {
      to: '/inmobiliaria',
      icon: '🏢',
      titulo: 'Mi inmobiliaria',
      descripcion: 'Datos de contacto y configuración de tu empresa.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-xl font-semibold text-slate-800">Hola, {usuario?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500 mb-6">{usuario?.inmobiliaria?.nombre}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-xs text-slate-500">Proyectos</p>
            <p className="text-2xl font-semibold text-slate-800">{totalProyectos ?? '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-xs text-slate-500">Planos digitalizados</p>
            <p className="text-2xl font-semibold text-slate-800">{totalPlanos ?? '—'}</p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Módulos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="bg-white rounded-xl shadow p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2"
            >
              <span className="text-3xl">{m.icon}</span>
              <h3 className="font-semibold text-slate-800">{m.titulo}</h3>
              <p className="text-sm text-slate-500">{m.descripcion}</p>
              {m.contador && <p className="text-xs text-indigo-600 font-medium mt-1">{m.contador}</p>}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
