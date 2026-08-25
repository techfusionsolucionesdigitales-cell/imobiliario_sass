<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
    use HasFactory;

    protected $fillable = [
        'plano_id',
        'codigo',
        'area_m2',
        'poligono',
        'precio',
        'estado',
        'cuota_inicial_pct',
        'plazos_meses_disponibles',
        'tasa_interes_anual',
    ];

    protected function casts(): array
    {
        return [
            'poligono' => 'array',
            'plazos_meses_disponibles' => 'array',
            'precio' => 'decimal:2',
            'cuota_inicial_pct' => 'decimal:2',
            'tasa_interes_anual' => 'decimal:2',
        ];
    }

    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }

    /**
     * Simula el financiamiento del lote para un número de cuotas dado.
     * Usa amortización francesa (cuota fija) cuando hay tasa de interés.
     */
    public function simularCuotas(int $numeroCuotas): array
    {
        $precio = (float) $this->precio;
        $cuotaInicial = round($precio * ((float) $this->cuota_inicial_pct / 100), 2);
        $montoFinanciar = round($precio - $cuotaInicial, 2);
        $tasaAnual = (float) $this->tasa_interes_anual;

        if ($tasaAnual <= 0) {
            $cuotaMensual = round($montoFinanciar / $numeroCuotas, 2);
            $tablaAmortizacion = $this->generarTablaSinInteres($montoFinanciar, $numeroCuotas, $cuotaMensual);
            $totalPagar = $cuotaInicial + ($cuotaMensual * $numeroCuotas);
        } else {
            $tasaMensual = $tasaAnual / 100 / 12;
            $cuotaMensual = round(
                $montoFinanciar * ($tasaMensual * (1 + $tasaMensual) ** $numeroCuotas)
                / ((1 + $tasaMensual) ** $numeroCuotas - 1),
                2
            );
            $tablaAmortizacion = $this->generarTablaFrancesa($montoFinanciar, $numeroCuotas, $cuotaMensual, $tasaMensual);
            $totalPagar = $cuotaInicial + array_sum(array_column($tablaAmortizacion, 'cuota'));
        }

        return [
            'lote_id' => $this->id,
            'precio' => $precio,
            'cuota_inicial_pct' => (float) $this->cuota_inicial_pct,
            'cuota_inicial_monto' => $cuotaInicial,
            'monto_financiar' => $montoFinanciar,
            'numero_cuotas' => $numeroCuotas,
            'tasa_interes_anual' => $tasaAnual,
            'cuota_mensual' => $cuotaMensual,
            'total_a_pagar' => round($totalPagar, 2),
            'tabla_amortizacion' => $tablaAmortizacion,
        ];
    }

    /** Devuelve la simulación para cada plazo configurado en el lote, para comparar opciones. */
    public function simularTodosLosPlazos(): array
    {
        return collect($this->plazos_meses_disponibles)
            ->map(fn (int $plazo) => $this->simularCuotas($plazo))
            ->values()
            ->all();
    }

    private function generarTablaSinInteres(float $saldo, int $numeroCuotas, float $cuotaMensual): array
    {
        $tabla = [];
        for ($mes = 1; $mes <= $numeroCuotas; $mes++) {
            $abonoCapital = $mes === $numeroCuotas ? $saldo : $cuotaMensual;
            $saldo = round($saldo - $abonoCapital, 2);
            $tabla[] = [
                'mes' => $mes,
                'cuota' => $abonoCapital,
                'interes' => 0.0,
                'abono_capital' => $abonoCapital,
                'saldo' => max($saldo, 0.0),
            ];
        }

        return $tabla;
    }

    private function generarTablaFrancesa(float $saldo, int $numeroCuotas, float $cuotaMensual, float $tasaMensual): array
    {
        $tabla = [];
        for ($mes = 1; $mes <= $numeroCuotas; $mes++) {
            $interes = round($saldo * $tasaMensual, 2);
            $abonoCapital = $mes === $numeroCuotas ? $saldo : round($cuotaMensual - $interes, 2);
            $cuota = $mes === $numeroCuotas ? round($abonoCapital + $interes, 2) : $cuotaMensual;
            $saldo = round($saldo - $abonoCapital, 2);

            $tabla[] = [
                'mes' => $mes,
                'cuota' => $cuota,
                'interes' => $interes,
                'abono_capital' => $abonoCapital,
                'saldo' => max($saldo, 0.0),
            ];
        }

        return $tabla;
    }
}
