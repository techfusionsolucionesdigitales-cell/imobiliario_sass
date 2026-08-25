import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Lote, SimulacionCuotas } from '../api/types'

const formatoMoneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

const estadoEtiqueta: Record<Lote['estado'], string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

const estadoColor: Record<Lote['estado'], string> = {
  disponible: 'bg-emerald-100 text-emerald-700',
  reservado: 'bg-amber-100 text-amber-700',
  vendido: 'bg-rose-100 text-rose-700',
}

export default function LoteSimulador({ lote, onClose }: { lote: Lote; onClose: () => void }) {
  const [plazo, setPlazo] = useState(lote.plazos_meses_disponibles[0])
  const [simulacion, setSimulacion] = useState<SimulacionCuotas | null>(null)
  const [cargando, setCargando] = useState(false)
  const [mostrarTabla, setMostrarTabla] = useState(false)

  useEffect(() => {
    setCargando(true)
    setMostrarTabla(false)
    api
      .get<SimulacionCuotas>(`/lotes/${lote.id}/simular`, { params: { cuotas: plazo } })
      .then((res) => setSimulacion(res.data))
      .finally(() => setCargando(false))
  }, [lote.id, plazo])

  return (
    <aside className="w-full sm:w-96 bg-white border-l border-slate-200 h-full overflow-y-auto p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Lote {lote.codigo}</h2>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${estadoColor[lote.estado]}`}>
            {estadoEtiqueta[lote.estado]}
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
          ✕
        </button>
      </div>

      <div className="text-sm text-slate-600 space-y-1">
        {lote.area_m2 && <p>Área: {lote.area_m2} m²</p>}
        <p className="text-xl font-semibold text-slate-800">{formatoMoneda.format(lote.precio)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Simular a cuántas cuotas</label>
        <select
          value={plazo}
          onChange={(e) => setPlazo(Number(e.target.value))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          {lote.plazos_meses_disponibles.map((p) => (
            <option key={p} value={p}>
              {p} cuotas
            </option>
          ))}
        </select>
      </div>

      {cargando && <p className="text-sm text-slate-400">Calculando...</p>}

      {simulacion && !cargando && (
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <Fila label={`Cuota inicial (${simulacion.cuota_inicial_pct}%)`} valor={simulacion.cuota_inicial_monto} />
            <Fila label="Monto a financiar" valor={simulacion.monto_financiar} />
            <Fila label="Tasa de interés anual" valorTexto={`${simulacion.tasa_interes_anual}%`} />
            <div className="border-t border-slate-200 my-2" />
            <Fila label={`Cuota mensual x${simulacion.numero_cuotas}`} valor={simulacion.cuota_mensual} destacado />
            <Fila label="Total a pagar" valor={simulacion.total_a_pagar} />
          </div>

          <button
            onClick={() => setMostrarTabla((v) => !v)}
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            {mostrarTabla ? 'Ocultar tabla de amortización' : 'Ver tabla de amortización'}
          </button>

          {mostrarTabla && (
            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Mes</th>
                    <th className="p-2 text-right">Cuota</th>
                    <th className="p-2 text-right">Interés</th>
                    <th className="p-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {simulacion.tabla_amortizacion.map((c) => (
                    <tr key={c.mes} className="border-t border-slate-100">
                      <td className="p-2">{c.mes}</td>
                      <td className="p-2 text-right">{formatoMoneda.format(c.cuota)}</td>
                      <td className="p-2 text-right">{formatoMoneda.format(c.interes)}</td>
                      <td className="p-2 text-right">{formatoMoneda.format(c.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

function Fila({ label, valor, valorTexto, destacado }: { label: string; valor?: number; valorTexto?: string; destacado?: boolean }) {
  return (
    <div className={`flex justify-between ${destacado ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span>{valorTexto ?? (valor !== undefined ? formatoMoneda.format(valor) : '')}</span>
    </div>
  )
}
