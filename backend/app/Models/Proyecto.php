<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;

    protected $fillable = [
        'inmobiliaria_id',
        'nombre',
        'ubicacion',
        'lat_centro',
        'lng_centro',
        'descripcion',
    ];

    public function inmobiliaria()
    {
        return $this->belongsTo(Inmobiliaria::class);
    }

    public function planos()
    {
        return $this->hasMany(Plano::class);
    }
}
