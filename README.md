# Sistema Inmobiliario Digital

Plataforma SaaS multi-tenant para que inmobiliarias digitalicen sus planos/lotizaciones y le muestren al cliente,
sobre un mapa interactivo, cada lote disponible junto con una simulación de cuotas de financiamiento (sin necesidad
de llevarlo físicamente al terreno).

## Stack

| Capa       | Tecnología |
|------------|------------|
| Mapas      | Leaflet + react-leaflet |
| Frontend   | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend    | Laravel 12 (API REST) |
| Auth       | JWT (`php-open-source-saver/jwt-auth`) — protege también el acceso a las imágenes de los planos |
| Roles      | `spatie/laravel-permission` |
| DB         | MySQL 8 |
| Infra      | Docker + docker-compose (VPS), Nginx |

## Arquitectura de datos

```
Inmobiliaria (tenant)
  └─ Usuario (admin_inmobiliaria | vendedor | cliente)
  └─ Proyecto (urbanización/lotización)
        └─ Plano (imagen georreferenciada + overlay sobre Leaflet)
              └─ Lote (polígono GeoJSON-like, precio, estado, config. de financiamiento)
```

Cada `Lote` guarda su propia configuración de financiamiento (`cuota_inicial_pct`, `plazos_meses_disponibles`,
`tasa_interes_anual`) y expone endpoints para simular la tabla de amortización a distintos plazos —
`GET /api/lotes/{id}/simular?cuotas=36`.

Las imágenes de los planos se guardan en un disco **privado** (no público) y solo se sirven a través de
`GET /api/planos/{id}/imagen`, protegida por JWT — nadie puede acceder a los archivos sin sesión válida.

El aislamiento entre inmobiliarias (multi-tenant) se hace por `inmobiliaria_id` en una sola base de datos,
reforzado con el middleware `tenant` (`app/Http/Middleware/EnsureTenantAccess.php`) que bloquea el acceso a
proyectos/planos/lotes de otra inmobiliaria aunque se adivine el ID.

## Desarrollo local

Requiere PHP 8.2+, Composer, Node 20+, MySQL 8 (en Windows con Laragon ya vienen todos).

```bash
# Backend
cd backend
composer install
cp .env.example .env      # ajusta DB_* a tu MySQL local
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed   # crea roles + datos demo
php artisan serve            # http://127.0.0.1:8000

# Frontend
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://127.0.0.1:8000/api
npm run dev                # http://localhost:5173
```

Usuario demo tras el seed: `admin@demo.test` / `password`.

## Despliegue en VPS (Docker)

```bash
cp backend/.env.example backend/.env
# edita backend/.env: APP_KEY (php artisan key:generate --show), JWT_SECRET (php artisan jwt:secret --show),
# DB_PASSWORD/DB_ROOT_PASSWORD, APP_URL, CORS_ALLOWED_ORIGINS, FRONTEND_URL

docker compose build
docker compose up -d
```

El backend queda en el puerto `8000` y el frontend en el `80`. Para producción real, coloca un reverse proxy
(Nginx o Caddy) delante con TLS (Let's Encrypt) apuntando a ambos puertos con sus respectivos dominios/subdominios.

## Roadmap sugerido

- [ ] Reservar/vender un lote desde el panel (cambiar `estado`) con registro de quién lo hizo
- [ ] Subida de comprobantes de pago por cuota
- [ ] Notificaciones (email/WhatsApp) al cliente con su simulación
- [ ] Rol `cliente` con vista de solo lectura del mapa + su propia simulación guardada
- [ ] Editor visual de bounds del overlay de imagen (arrastrar esquinas en vez de escribir coordenadas)
