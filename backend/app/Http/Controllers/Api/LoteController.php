<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lote;
use App\Models\Plano;
use Illuminate\Http\Request;

class LoteController extends Controller
{
    public function index(Plano $plano)
    {
        return $plano->lotes;
    }

    public function store(Request $request, Plano $plano)
    {
        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:50'],
            'area_m2' => ['nullable', 'numeric', 'min:0'],
            'poligono' => ['required', 'array', 'min:3'],
            'poligono.*' => ['array', 'size:2'],
            'poligono.*.*' => ['numeric'],
            'precio' => ['required', 'numeric', 'min:0'],
            'estado' => ['nullable', 'in:disponible,reservado,vendido'],
            'cuota_inicial_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'plazos_meses_disponibles' => ['required', 'array', 'min:1'],
            'plazos_meses_disponibles.*' => ['integer', 'min:1', 'max:360'],
            'tasa_interes_anual' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $lote = $plano->lotes()->create([
            ...$data,
            'estado' => $data['estado'] ?? 'disponible',
            'cuota_inicial_pct' => $data['cuota_inicial_pct'] ?? 20,
            'tasa_interes_anual' => $data['tasa_interes_anual'] ?? 0,
        ]);

        return response()->json($lote, 201);
    }

    public function show(Lote $lote)
    {
        return $lote;
    }

    public function update(Request $request, Lote $lote)
    {
        $data = $request->validate([
            'codigo' => ['sometimes', 'string', 'max:50'],
            'area_m2' => ['nullable', 'numeric', 'min:0'],
            'poligono' => ['sometimes', 'array', 'min:3'],
            'poligono.*' => ['array', 'size:2'],
            'poligono.*.*' => ['numeric'],
            'precio' => ['sometimes', 'numeric', 'min:0'],
            'estado' => ['sometimes', 'in:disponible,reservado,vendido'],
            'cuota_inicial_pct' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'plazos_meses_disponibles' => ['sometimes', 'array', 'min:1'],
            'plazos_meses_disponibles.*' => ['integer', 'min:1', 'max:360'],
            'tasa_interes_anual' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        ]);

        $lote->update($data);

        return $lote;
    }

    public function destroy(Lote $lote)
    {
        $lote->delete();

        return response()->json(status: 204);
    }

    /**
     * Simula el pago del lote para un número de cuotas específico.
     * GET /lotes/{lote}/simular?cuotas=36
     */
    public function simular(Request $request, Lote $lote)
    {
        $request->validate([
            'cuotas' => ['required', 'integer', 'min:1', 'max:360'],
        ]);

        return $lote->simularCuotas((int) $request->query('cuotas'));
    }

    /**
     * Devuelve la simulación para todos los plazos configurados en el lote,
     * útil para mostrarle al cliente varias opciones de cuotas de una vez.
     */
    public function simulaciones(Lote $lote)
    {
        return $lote->simularTodosLosPlazos();
    }
}
