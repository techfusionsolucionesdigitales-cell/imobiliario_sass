<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plano extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'nombre',
        'imagen_path',
        'bounds_norte',
        'bounds_sur',
        'bounds_este',
        'bounds_oeste',
        'opacidad',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function lotes()
    {
        return $this->hasMany(Lote::class);
    }
}
