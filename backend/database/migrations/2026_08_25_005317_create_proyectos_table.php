<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inmobiliaria_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->string('ubicacion')->nullable();
            $table->decimal('lat_centro', 10, 7)->nullable();
            $table->decimal('lng_centro', 10, 7)->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
