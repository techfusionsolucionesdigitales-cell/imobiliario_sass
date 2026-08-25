<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InmobiliariaController;
use App\Http\Controllers\Api\LoteController;
use App\Http\Controllers\Api\PlanoController;
use App\Http\Controllers\Api\ProyectoController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('registro', [AuthController::class, 'registerInmobiliaria']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('inmobiliaria', [InmobiliariaController::class, 'show']);
    Route::put('inmobiliaria', [InmobiliariaController::class, 'update']);

    Route::apiResource('proyectos', ProyectoController::class)
        ->middleware('tenant');

    Route::get('proyectos/{proyecto}/planos', [PlanoController::class, 'index'])->middleware('tenant');
    Route::post('proyectos/{proyecto}/planos', [PlanoController::class, 'store'])->middleware('tenant');

    Route::get('planos/{plano}', [PlanoController::class, 'show'])->middleware('tenant');
    Route::post('planos/{plano}', [PlanoController::class, 'update'])->middleware('tenant'); // POST + _method=PUT para soportar upload de archivo
    Route::delete('planos/{plano}', [PlanoController::class, 'destroy'])->middleware('tenant');
    Route::get('planos/{plano}/imagen', [PlanoController::class, 'imagen'])->middleware('tenant');

    Route::get('planos/{plano}/lotes', [LoteController::class, 'index'])->middleware('tenant');
    Route::post('planos/{plano}/lotes', [LoteController::class, 'store'])->middleware('tenant');

    Route::get('lotes/{lote}', [LoteController::class, 'show'])->middleware('tenant');
    Route::put('lotes/{lote}', [LoteController::class, 'update'])->middleware('tenant');
    Route::delete('lotes/{lote}', [LoteController::class, 'destroy'])->middleware('tenant');
    Route::get('lotes/{lote}/simular', [LoteController::class, 'simular'])->middleware('tenant');
    Route::get('lotes/{lote}/simulaciones', [LoteController::class, 'simulaciones'])->middleware('tenant');
});
