<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plano;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlanoController extends Controller
{
    public function index(Proyecto $proyecto)
    {
        return $proyecto->planos()->withCount('lotes')->get();
    }

    public function store(Request $request, Proyecto $proyecto)
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'imagen' => ['required', 'image', 'max:10240'],
            'bounds_norte' => ['required', 'numeric', 'between:-90,90'],
            'bounds_sur' => ['required', 'numeric', 'between:-90,90'],
            'bounds_este' => ['required', 'numeric', 'between:-180,180'],
            'bounds_oeste' => ['required', 'numeric', 'between:-180,180'],
            'opacidad' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        // Se guarda en el disco privado; solo se sirve vía ruta autenticada con JWT.
        $path = $request->file('imagen')->store("planos/{$proyecto->id}", 'local');

        $plano = $proyecto->planos()->create([
            'nombre' => $data['nombre'],
            'imagen_path' => $path,
            'bounds_norte' => $data['bounds_norte'],
            'bounds_sur' => $data['bounds_sur'],
            'bounds_este' => $data['bounds_este'],
            'bounds_oeste' => $data['bounds_oeste'],
            'opacidad' => $data['opacidad'] ?? 80,
        ]);

        return response()->json($plano, 201);
    }

    public function show(Plano $plano)
    {
        return $plano->load('lotes');
    }

    public function update(Request $request, Plano $plano)
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:255'],
            'bounds_norte' => ['sometimes', 'numeric', 'between:-90,90'],
            'bounds_sur' => ['sometimes', 'numeric', 'between:-90,90'],
            'bounds_este' => ['sometimes', 'numeric', 'between:-180,180'],
            'bounds_oeste' => ['sometimes', 'numeric', 'between:-180,180'],
            'opacidad' => ['sometimes', 'integer', 'min:0', 'max:100'],
        ]);

        if ($request->hasFile('imagen')) {
            $request->validate(['imagen' => ['image', 'max:10240']]);
            Storage::disk('local')->delete($plano->imagen_path);
            $data['imagen_path'] = $request->file('imagen')->store("planos/{$plano->proyecto_id}", 'local');
        }

        $plano->update($data);

        return $plano;
    }

    public function destroy(Plano $plano)
    {
        Storage::disk('local')->delete($plano->imagen_path);
        $plano->delete();

        return response()->json(status: 204);
    }

    /**
     * Sirve la imagen del plano solo a usuarios autenticados (JWT) con acceso al tenant.
     */
    public function imagen(Plano $plano)
    {
        if (! Storage::disk('local')->exists($plano->imagen_path)) {
            abort(404);
        }

        return Storage::disk('local')->response($plano->imagen_path);
    }
}
