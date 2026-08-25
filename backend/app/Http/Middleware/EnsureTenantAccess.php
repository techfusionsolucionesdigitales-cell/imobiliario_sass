<?php

namespace App\Http\Middleware;

use App\Models\Lote;
use App\Models\Plano;
use App\Models\Proyecto;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bloquea el acceso a recursos (proyectos, planos, lotes) que no pertenezcan
 * a la inmobiliaria del usuario autenticado.
 */
class EnsureTenantAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        foreach ($request->route()->parameters() as $param) {
            $inmobiliariaId = match (true) {
                $param instanceof Proyecto => $param->inmobiliaria_id,
                $param instanceof Plano => $param->proyecto->inmobiliaria_id,
                $param instanceof Lote => $param->plano->proyecto->inmobiliaria_id,
                default => null,
            };

            if ($inmobiliariaId !== null && $inmobiliariaId !== $user->inmobiliaria_id) {
                abort(403, 'No tienes acceso a este recurso.');
            }
        }

        return $next($request);
    }
}
