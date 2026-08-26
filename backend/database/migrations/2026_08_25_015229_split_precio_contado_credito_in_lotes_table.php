<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lotes', function (Blueprint $table) {
            $table->renameColumn('precio', 'precio_contado');
        });

        Schema::table('lotes', function (Blueprint $table) {
            $table->decimal('precio_credito', 12, 2)->after('precio_contado')->nullable();
        });

        // Por defecto, si no se especifica precio a crédito, se asume igual al de contado.
        DB::table('lotes')->whereNull('precio_credito')->update([
            'precio_credito' => DB::raw('precio_contado'),
        ]);

        Schema::table('lotes', function (Blueprint $table) {
            $table->decimal('precio_credito', 12, 2)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotes', function (Blueprint $table) {
            $table->dropColumn('precio_credito');
        });

        Schema::table('lotes', function (Blueprint $table) {
            $table->renameColumn('precio_contado', 'precio');
        });
    }
};
