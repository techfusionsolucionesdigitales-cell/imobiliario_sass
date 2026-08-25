<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plano_id')->constrained()->cascadeOnDelete();
            $table->string('codigo');
            $table->decimal('area_m2', 10, 2)->nullable();
            $table->json('poligono');
            $table->decimal('precio', 12, 2);
            $table->enum('estado', ['disponible', 'reservado', 'vendido'])->default('disponible');

            // Configuración de financiamiento para el simulador de cuotas
            $table->decimal('cuota_inicial_pct', 5, 2)->default(20);
            $table->json('plazos_meses_disponibles');
            $table->decimal('tasa_interes_anual', 5, 2)->default(0);

            $table->timestamps();

            $table->unique(['plano_id', 'codigo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotes');
    }
};
