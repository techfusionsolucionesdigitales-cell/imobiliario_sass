<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use Illuminate\Http\Request;

class ProyectoController extends Controller
{
    public function index(Request $request)
    {
        return Proyecto::where('inmobiliaria_id', $request->user()->inmobiliaria_id)
            ->withCount('planos')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'lat_centro' => ['required', 'numeric', 'between:-90,90'],
            'lng_centro' => ['required', 'numeric', 'between:-180,180'],
            'descripcion' => ['nullable', 'string'],
        ]);

        $data['inmobiliaria_id'] = $request->user()->inmobiliaria_id;

        return response()->json(Proyecto::create($data), 201);
    }

    public function show(Proyecto $proyecto)
    {
        return $proyecto->load('planos');
    }

    public function update(Request $request, Proyecto $proyecto)
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:255'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'lat_centro' => ['sometimes', 'numeric', 'between:-90,90'],
            'lng_centro' => ['sometimes', 'numeric', 'between:-180,180'],
            'descripcion' => ['nullable', 'string'],
        ]);

        $proyecto->update($data);

        return $proyecto;
    }

    public function destroy(Proyecto $proyecto)
    {
        $proyecto->delete();

        return response()->json(status: 204);
    }
}
