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
      <main className="max-w-[1600px] mx-auto p-10">
        <h1 className="text-3xl font-semibold text-slate-800">Hola, {usuario?.name?.split(' ')[0]}</h1>
        <p className="text-lg text-slate-500 mb-10">{usuario?.inmobiliaria?.nombre}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <p className="text-sm text-slate-500">Proyectos</p>
            <p className="text-4xl font-semibold text-slate-800">{totalProyectos ?? '—'}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <p className="text-sm text-slate-500">Planos digitalizados</p>
            <p className="text-4xl font-semibold text-slate-800">{totalPlanos ?? '—'}</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-4">Módulos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulos.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3 aspect-square justify-center"
            >
              <span className="text-6xl">{m.icon}</span>
              <h3 className="text-lg font-semibold text-slate-800">{m.titulo}</h3>
              <p className="text-sm text-slate-500">{m.descripcion}</p>
              {m.contador && <p className="text-sm text-indigo-600 font-medium mt-1">{m.contador}</p>}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
