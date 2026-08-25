<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->string('imagen_path');
            // Límites del overlay de imagen sobre Leaflet (esquinas geográficas reales del plano escaneado)
            $table->decimal('bounds_norte', 10, 7);
            $table->decimal('bounds_sur', 10, 7);
            $table->decimal('bounds_este', 10, 7);
            $table->decimal('bounds_oeste', 10, 7);
            $table->unsignedTinyInteger('opacidad')->default(80);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planos');
    }
};
