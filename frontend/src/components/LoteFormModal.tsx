import { useState, type FormEvent } from 'react'

interface Props {
  puntos: [number, number][]
  onGuardar: (data: {
    codigo: string
    area_m2: number | null
    precio_contado: number
    precio_credito: number
    cuota_inicial_pct: number
    tasa_interes_anual: number
    plazos_meses_disponibles: number[]
  }) => Promise<void>
  onCancelar: () => void
}

export default function LoteFormModal({ puntos, onGuardar, onCancelar }: Props) {
  const [codigo, setCodigo] = useState('')
  const [area, setArea] = useState('')
  const [precioContado, setPrecioContado] = useState('')
  const [precioCredito, setPrecioCredito] = useState('')
  const [cuotaInicial, setCuotaInicial] = useState('20')
  const [tasa, setTasa] = useState('12')
  const [plazos, setPlazos] = useState('12,24,36,48,60')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const plazosArr = plazos
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((p) => p > 0)

    if (plazosArr.length === 0) {
      setError('Ingresa al menos un plazo válido, ej: 12,24,36')
      return
    }

    setError(null)
    setGuardando(true)
    try {
      await onGuardar({
        codigo,
        area_m2: area ? Number(area) : null,
        precio_contado: Number(precioContado),
        precio_credito: Number(precioCredito),
        cuota_inicial_pct: Number(cuotaInicial),
        tasa_interes_anual: Number(tasa),
        plazos_meses_disponibles: plazosArr,
      })
    } catch {
      setError('No se pudo guardar el lote.')
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Nuevo lote</h2>
        <p className="text-xs text-slate-500">Polígono con {puntos.length} vértices marcado en el mapa.</p>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Código (ej. A-04)"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2"
          />
          <input
            placeholder="Área m²"
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Precio al contado</label>
            <input
              placeholder="Precio al contado"
              type="number"
              required
              value={precioContado}
              onChange={(e) => setPrecioContado(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Precio a crédito</label>
            <input
              placeholder="Precio a crédito"
              type="number"
              required
              value={precioCredito}
              onChange={(e) => setPrecioCredito(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Cuota inicial (%)</label>
            <input
              type="number"
              value={cuotaInicial}
              onChange={(e) => setCuotaInicial(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Tasa interés anual (%)</label>
            <input
              type="number"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Plazos disponibles (meses, separados por coma)</label>
          <input
            value={plazos}
            onChange={(e) => setPlazos(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancelar} className="px-4 py-2 text-sm text-slate-600">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar lote'}
          </button>
        </div>
      </form>
    </div>
  )
}
