<?php

namespace Database\Seeders;

use App\Models\Inmobiliaria;
use App\Models\Lote;
use App\Models\Plano;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inmobiliaria = Inmobiliaria::firstOrCreate(
            ['slug' => 'inmobiliaria-demo'],
            ['nombre' => 'Inmobiliaria Demo', 'email' => 'contacto@inmobiliariademo.test']
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@demo.test'],
            [
                'inmobiliaria_id' => $inmobiliaria->id,
                'name' => 'Admin Demo',
                'password' => Hash::make('password'),
            ]
        );
        if (! $admin->hasRole('admin_inmobiliaria')) {
            $admin->assignRole('admin_inmobiliaria');
        }

        $vendedor = User::firstOrCreate(
            ['email' => 'vendedor@demo.test'],
            [
                'inmobiliaria_id' => $inmobiliaria->id,
                'name' => 'Vendedor Demo',
                'password' => Hash::make('password'),
            ]
        );
        if (! $vendedor->hasRole('vendedor')) {
            $vendedor->assignRole('vendedor');
        }

        $proyecto = Proyecto::firstOrCreate(
            ['inmobiliaria_id' => $inmobiliaria->id, 'nombre' => 'Urbanización Los Álamos'],
            [
                'ubicacion' => 'Km 12 Carretera Central',
                'lat_centro' => -12.0470,
                'lng_centro' => -77.0430,
                'descripcion' => 'Proyecto de lotización demo para pruebas del sistema.',
            ]
        );

        $plano = Plano::firstOrCreate(
            ['proyecto_id' => $proyecto->id, 'nombre' => 'Plano General'],
            [
                'imagen_path' => 'planos/demo-plano.jpg',
                'bounds_norte' => -12.0455,
                'bounds_sur' => -12.0485,
                'bounds_este' => -77.0410,
                'bounds_oeste' => -77.0450,
                'opacidad' => 80,
            ]
        );

        $lotesDemo = [
            [
                'codigo' => 'A-01',
                'area_m2' => 180,
                'precio_contado' => 45000,
                'precio_credito' => 49500,
                'estado' => 'disponible',
                'poligono' => [
                    [-12.0460, -77.0448],
                    [-12.0460, -77.0442],
                    [-12.0465, -77.0442],
                    [-12.0465, -77.0448],
                ],
            ],
            [
                'codigo' => 'A-02',
                'area_m2' => 200,
                'precio_contado' => 52000,
                'precio_credito' => 57200,
                'estado' => 'reservado',
                'poligono' => [
                    [-12.0460, -77.0441],
                    [-12.0460, -77.0435],
                    [-12.0465, -77.0435],
                    [-12.0465, -77.0441],
                ],
            ],
            [
                'codigo' => 'A-03',
                'area_m2' => 220,
                'precio_contado' => 58000,
                'precio_credito' => 63800,
                'estado' => 'vendido',
                'poligono' => [
                    [-12.0460, -77.0434],
                    [-12.0460, -77.0428],
                    [-12.0465, -77.0428],
                    [-12.0465, -77.0434],
                ],
            ],
        ];

        foreach ($lotesDemo as $data) {
            Lote::firstOrCreate(
                ['plano_id' => $plano->id, 'codigo' => $data['codigo']],
                [
                    'area_m2' => $data['area_m2'],
                    'poligono' => $data['poligono'],
                    'precio_contado' => $data['precio_contado'],
                    'precio_credito' => $data['precio_credito'],
                    'estado' => $data['estado'],
                    'cuota_inicial_pct' => 20,
                    'plazos_meses_disponibles' => [12, 24, 36, 48, 60],
                    'tasa_interes_anual' => 12,
                ]
            );
        }
    }
}
