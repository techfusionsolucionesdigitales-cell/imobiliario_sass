import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ImageOverlay, MapContainer, Polygon, useMapEvents } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import { api, imagenPlanoUrl } from '../api/client'
import type { Lote, Plano } from '../api/types'
import Navbar from '../components/Navbar'
import LoteSimulador from '../components/LoteSimulador'
import LoteFormModal from '../components/LoteFormModal'

const colorPorEstado: Record<Lote['estado'], string> = {
  disponible: '#10b981',
  reservado: '#f59e0b',
  vendido: '#ef4444',
}

export default function MapaPage() {
  const { id } = useParams()
  const [plano, setPlano] = useState<Plano | null>(null)
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null)
  const [modoDibujo, setModoDibujo] = useState(false)
  const [puntosNuevos, setPuntosNuevos] = useState<[number, number][]>([])
  const [mostrarFormLote, setMostrarFormLote] = useState(false)

  function cargar() {
    api.get<Plano>(`/planos/${id}`).then((res) => setPlano(res.data))
    api.get<Lote[]>(`/planos/${id}/lotes`).then((res) => setLotes(res.data))
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!plano) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando plano...</div>
  }

  const bounds: LatLngBoundsExpression = [
    [plano.bounds_sur, plano.bounds_oeste],
    [plano.bounds_norte, plano.bounds_este],
  ]

  function cancelarDibujo() {
    setModoDibujo(false)
    setPuntosNuevos([])
    setMostrarFormLote(false)
  }

  async function guardarLote(data: {
    codigo: string
    area_m2: number | null
    precio: number
    cuota_inicial_pct: number
    tasa_interes_anual: number
    plazos_meses_disponibles: number[]
  }) {
    await api.post(`/planos/${id}/lotes`, { ...data, poligono: puntosNuevos })
    cancelarDibujo()
    cargar()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-slate-200">
        <h1 className="font-semibold text-slate-800">{plano.nombre}</h1>
        <div className="flex items-center gap-3">
          {modoDibujo && (
            <span className="text-xs text-slate-500">
              {puntosNuevos.length} punto(s) — clic en el mapa para agregar, mínimo 3
            </span>
          )}
          {modoDibujo && (
            <button
              onClick={() => setPuntosNuevos([])}
              disabled={puntosNuevos.length === 0}
              className="text-sm text-slate-500 hover:underline disabled:opacity-40"
            >
              Limpiar puntos
            </button>
          )}
          <button
            onClick={() => {
              if (modoDibujo) {
                cancelarDibujo()
              } else {
                setModoDibujo(true)
                setLoteSeleccionado(null)
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              modoDibujo ? 'bg-slate-200 text-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {modoDibujo ? 'Cancelar dibujo' : '+ Agregar lote'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <MapContainer bounds={bounds} className="w-full h-full" maxZoom={22}>
            <ImageOverlay url={imagenPlanoUrl(plano.id)} bounds={bounds} opacity={plano.opacidad / 100} />

            {lotes.map((lote) => (
              <Polygon
                key={lote.id}
                positions={lote.poligono as LatLngExpression[]}
                pathOptions={{
                  color: colorPorEstado[lote.estado],
                  fillColor: colorPorEstado[lote.estado],
                  fillOpacity: 0.35,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => !modoDibujo && setLoteSeleccionado(lote),
                }}
              />
            ))}

            {puntosNuevos.length > 0 && (
              <Polygon
                positions={puntosNuevos as LatLngExpression[]}
                pathOptions={{ color: '#6366f1', dashArray: '6 4', fillOpacity: 0.15 }}
              />
            )}

            {modoDibujo && <CapturadorClicks onClick={(latlng) => setPuntosNuevos((p) => [...p, latlng])} />}
          </MapContainer>

          {modoDibujo && puntosNuevos.length >= 3 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[900]">
              <button
                onClick={() => setMostrarFormLote(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg font-medium hover:bg-indigo-700"
              >
                Finalizar polígono ✓
              </button>
            </div>
          )}
        </div>

        {loteSeleccionado && !modoDibujo && (
          <LoteSimulador lote={loteSeleccionado} onClose={() => setLoteSeleccionado(null)} />
        )}
      </div>

      {mostrarFormLote && (
        <LoteFormModal puntos={puntosNuevos} onGuardar={guardarLote} onCancelar={() => setMostrarFormLote(false)} />
      )}
    </div>
  )
}

function CapturadorClicks({ onClick }: { onClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}
