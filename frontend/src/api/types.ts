export interface Inmobiliaria {
  id: number
  nombre: string
  slug: string
  email: string | null
  telefono: string | null
  activo: boolean
}

export interface Usuario {
  id: number
  inmobiliaria_id: number
  name: string
  username: string
  email: string | null
  inmobiliaria?: Inmobiliaria
  roles?: string[]
}

export interface Proyecto {
  id: number
  inmobiliaria_id: number
  nombre: string
  ubicacion: string | null
  lat_centro: number
  lng_centro: number
  descripcion: string | null
  planos_count?: number
}

export interface Plano {
  id: number
  proyecto_id: number
  nombre: string
  imagen_path: string
  bounds_norte: number
  bounds_sur: number
  bounds_este: number
  bounds_oeste: number
  opacidad: number
  lotes_count?: number
  lotes?: Lote[]
}

export type EstadoLote = 'disponible' | 'reservado' | 'vendido'

export interface Lote {
  id: number
  plano_id: number
  codigo: string
  area_m2: number | null
  poligono: [number, number][]
  precio_contado: number
  precio_credito: number
  estado: EstadoLote
  cuota_inicial_pct: number
  plazos_meses_disponibles: number[]
  tasa_interes_anual: number
}

export interface CuotaAmortizacion {
  mes: number
  cuota: number
  interes: number
  abono_capital: number
  saldo: number
}

export interface SimulacionCuotas {
  lote_id: number
  precio_contado: number
  precio_credito: number
  ahorro_al_contado: number
  cuota_inicial_pct: number
  cuota_inicial_monto: number
  monto_financiar: number
  numero_cuotas: number
  tasa_interes_anual: number
  cuota_mensual: number
  total_a_pagar: number
  tabla_amortizacion: CuotaAmortizacion[]
}
