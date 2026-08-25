<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inmobiliaria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'slug',
        'email',
        'telefono',
        'logo_path',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function usuarios()
    {
        return $this->hasMany(User::class);
    }

    public function proyectos()
    {
        return $this->hasMany(Proyecto::class);
    }
}
