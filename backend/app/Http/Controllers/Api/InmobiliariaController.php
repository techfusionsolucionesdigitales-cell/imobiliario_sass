<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InmobiliariaController extends Controller
{
    public function show(Request $request)
    {
        return $request->user()->inmobiliaria;
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email'],
            'telefono' => ['sometimes', 'nullable', 'string', 'max:30'],
        ]);

        $inmobiliaria = $request->user()->inmobiliaria;
        $inmobiliaria->update($data);

        return $inmobiliaria;
    }
}
