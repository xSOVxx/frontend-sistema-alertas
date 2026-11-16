---
name: frontend-sistema-alertas
description: Use when working on this Angular 20 project (frontend-sistema-alertas / PonteAlerta Piura). Covers project structure, design system tokens, shared components, routing, auth guards and interceptor, forms, MapLibre map, environments, deployment to Vercel, CI, Stitch MCP workflow and testing conventions.
---

# Prácticas del proyecto frontend-sistema-alertas

## Stack

- Angular 20 (standalone, signals, control flow `@if`/`@for`).
- Karma + Jasmine para tests.
- Sin librerías de UI: CSS plano con los tokens del design system.
- PWA con `@angular/service-worker`.
- MapLibre GL para el mapa.
- Prettier configurado en `package.json`.

## Estructura de carpetas

```text
src/app/
├── core/                       # infraestructura transversal
│   ├── api/api-endpoints.ts    # rutas centralizadas del backend
│   ├── auth/
│   │   ├── guards/             # authGuard, adminGuard, volunteerGuard
│   │   ├── interceptors/       # authInterceptor (Bearer token)
│   │   ├── models/             # AuthSession, roles
│   │   └── services/           # auth.service, session.service
│   ├── data/                   # catálogos estáticos (ubigeo)
│   ├── services/               # servicios globales (network-status)
│   └── index.ts                # barrel de exportaciones
├── shared/
│   ├── components/             # bottom-nav, topbar, network-banner
│   └── index.ts
├── features/                   # una carpeta por pantalla
│   └── <feature>/
│       ├── pages/<pagina>/<pagina>.component.ts|html|css|spec.ts
│       ├── components/<componente>/...
│       ├── models/
│       └── services/
├── environments/
│   ├── environment.ts          # local → http://localhost:3000
│   └── environment.prod.ts     # producción → Render
├── app.config.ts
├── app.routes.ts
└── app.ts
stitch/                         # HTML de referencia extraído de Stitch
public/maplibre-gl/             # worker de MapLibre copiado a mano
```

## Convenciones de código

- Componentes con sufijo `.component.ts` / `.component.html` / `.component.css` / `.component.spec.ts`.
- Componentes standalone: declarar dependencias en `imports` (no NgModules).
- Estado local con `signal`/`computed`; métodos expuestos al template como `protected`.
- Formularios: `ReactiveFormsModule` + `FormGroup`/`FormControl`; botón submit
  `[disabled]="form.invalid"` y `markAllAsTouched()` en el submit.
- Timers y recursos: limpiar con `DestroyRef` (`onDestroy(() => clearTimeout(...))`, `map.remove()`).
- Suscripciones HTTP con `takeUntilDestroyed(this.destroyRef)`.
- DOM: nunca `document.getElementById`; usar `@ViewChild` con template ref.
- Imports con alias `@core`, `@shared`, `@features` cuando existan en `tsconfig.json`.
- Sin comentarios en el código salvo que se pidan explícitamente.

## Autenticación

- El token se guarda en `SessionService`; `authInterceptor` agrega
  `Authorization: Bearer <token>` a todas las peticiones.
- `authGuard` protege rutas de usuario, `adminGuard` las de ADMIN y
  `volunteerGuard` el panel de voluntario.
- El login y el registro van contra el backend (`/auth/login`, `/auth/register`),
  nunca directo a Keycloak.
- Roles: `ADMIN`, `VOLUNTEER`, `AFFECTED`.
- Al recibir 401, limpiar sesión y redirigir a `/login`.
- Los endpoints se declaran en `core/api/api-endpoints.ts`, no como strings sueltos.

## Design system

- Tokens en `:root` de `src/styles.css` (`--primary`, `--surface`, `--outline-variant`, `--error`, etc.).
- Clases globales: `.material-symbols-outlined`, `.filled` (icono relleno), `.spin`, `.avatar-btn`.
- Fuentes: Inter (texto) y Material Symbols (iconos), cargadas en `src/index.html`.
- Presupuesto de estilos por componente: 7 kB warning / 10 kB error (`angular.json`);
  si se excede, limpiar CSS antes de subir el budget.
- Iconos con ligaduras de Material Symbols (`person`, `map`, `warning`, etc.).

## Componentes compartidos

- `app-bottom-nav`: tabs Noticias `/feed`, Mapa `/mapa`, Ayuda `/voluntariado`,
  Perfil `/perfil`. Usa `routerLink` + `routerLinkActive`.
- `app-topbar`: input `title` y proyección con slots `[topbar-left]` / `[topbar-right]`.
- `app-network-banner`: aviso de conexión usando `NetworkStatusService`.

## Rutas

Lazy loading con `loadComponent` en `app.routes.ts` (un chunk por feature).

| Ruta | Vista | Guard |
|---|---|---|
| `/feed` | Feed de alertas | — |
| `/alertas/:id` | Detalle de alerta | — |
| `/mapa` | Mapa de emergencias | — |
| `/monitoreo` | Clima y sismos | — |
| `/voluntariado` | Voluntariado y donaciones | — |
| `/soporte` | Catálogo y tickets | — |
| `/admin/tickets` | Bandeja ITSM | `adminGuard` |
| `/admin/metrics` | Panel analítico | `adminGuard` |
| `/admin/recursos` | CRUD de mapa e inventario | `adminGuard` |
| `/voluntario` | Panel de voluntario | `volunteerGuard` |
| `/perfil` | Perfil del usuario | `authGuard` |
| `/login`, `/register` | Autenticación | — |

`/` redirige a `/feed`.

## Mapa (MapLibre GL)

- `import('maplibre-gl')` dinámico dentro de `afterNextRender` (chunk lazy).
- `setWorkerUrl('maplibre-gl/maplibre-gl-worker.mjs')` antes de crear el mapa
  (los workers están en `public/maplibre-gl/`).
- Estilos MapTiler: `https://api.maptiler.com/maps/base-v4/style.json?key=...`
  (siempre con `/style.json`; sin él devuelve HTML).
- Key de MapTiler en `src/environments/environment.ts` (clave pública de cliente; nunca secretos).
- Limpiar el mapa con `map.remove()` en `DestroyRef`.

## Environments

`angular.json` reemplaza `environment.ts` por `environment.prod.ts` en la build de producción.

```ts
// environment.ts (local)
export const environment = {
  apiBaseUrl: 'http://localhost:3000',
  useMockAuth: false,
  maptilerApiKey: '...'
};

// environment.prod.ts (producción)
export const environment = {
  apiBaseUrl: 'https://integrador-ii-backend.onrender.com',
  useMockAuth: false,
  maptilerApiKey: '...'
};
```

Reglas:

- La URL del backend nunca se hardcodea en un servicio.
- `.env` local no se commitea.
- La clave de MapTiler es pública de cliente; los secretos van solo en el backend.

## Despliegue en Vercel

| Campo | Valor |
|---|---|
| Plataforma | Vercel |
| URL | `https://frontend-sistema-alertas.vercel.app` |
| Build | `npm run build` |
| Output | `dist/frontend-sistema-alertas/browser` |
| API | Render (`environment.prod.ts`) |

Pasos:

1. Push a `main` → Vercel construye automáticamente.
2. Verificar que `environment.prod.ts` apunte al backend correcto.
3. Confirmar CORS en Render: `CORS_ORIGIN` debe incluir la URL de Vercel.
4. Rollback: Vercel → Deployments → deployment anterior → Promote to Production.

## CI

`.github/workflows/ci.yml` (`Frontend CI`) se ejecuta en push/PR a `main`, `master`, `develop`:

```text
npm ci → npm run build → Chrome headless → ng test --watch=false --browsers=ChromeHeadless
```

Un cambio no se integra si el pipeline falla.

## Verificación

```bash
npx ng build
npx ng test --watch=false --browsers=ChromeHeadless
npm start          # puerto 4200
```

Siempre correr build y tests después de tocar código; ambos deben pasar sin warnings.

## Flujo de trabajo con Stitch (MCP)

- MCP configurado en `opencode.json`; la API key vive en `STITCH_API_KEY`.
- Extraer pantalla: `list_screens` → `get_screen_code` (ver `stitch/*.html`).
- Convertir a Angular: HTML de Stitch → template con bindings; Tailwind → CSS plano
  con tokens; scripts embebidos → lógica en el componente.

## Errores conocidos

| Síntoma | Causa | Solución |
|---|---|---|
| 401 en todas las peticiones | Token vencido o `iss` de Keycloak cambió | Volver a iniciar sesión |
| CORS bloqueado en producción | `CORS_ORIGIN` sin la URL de Vercel | Actualizar en Render y redeploy |
| Mapa en blanco | Falta el worker o el `/style.json` | Revisar `public/maplibre-gl/` y la URL de MapTiler |
| Estilos no aplican | Budget excedido o token inexistente | Revisar `angular.json` y `styles.css` |
| PWA no actualiza | Service worker cacheado | `registrationStrategy` y hard reload |

## Definición de terminado

- `ng build` sin warnings.
- Tests en verde.
- Sin `console.log` ni datos mock.
- Estados de carga y error implementados.
- Ruta protegida con el guard correcto.
- Documento afectado actualizado.
