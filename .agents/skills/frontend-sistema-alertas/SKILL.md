---
name: frontend-sistema-alertas
description: Use when working on this Angular 20 project (frontend-sistema-alertas / PonteAlerta Piura). Covers the project structure, design system tokens, shared components, routing, forms, MapLibre map, Stitch MCP workflow and testing conventions.
---

# Prácticas del proyecto frontend-sistema-alertas

## Stack
- Angular 20 (standalone, signals, control flow `@if`/`@for`)
- Karma + Jasmine para tests; prettier config en `package.json`
- Sin librerías de UI: CSS plano con los tokens del design system

## Estructura de carpetas
```
src/app/
├── shared/components/    # componentes reutilizables y tontos (BottomNav, Topbar)
├── features/             # una carpeta por pantalla (auth/login, feed, mapa, voluntariado)
├── environments/         # claves públicas de cliente
├── app.config.ts / app.routes.ts / app.ts
stitch/                   # HTML extraído de Stitch (referencia de diseño)
public/maplibre-gl/       # worker de MapLibre copiado a mano (sincronizar con la versión del paquete)
```

## Convenciones de código
- Archivos por componente: `<nombre>.ts` + `<nombre>.html` + `<nombre>.css` + `<nombre>.spec.ts` (sin sufijo `.component`)
- Componentes standalone: declarar dependencias en `imports` (no NgModules)
- Estado local con `signal`/`computed`; métodos expuestos al template como `protected`
- Formularios: `ReactiveFormsModule` + `FormGroup`/`FormControl`; botón submit `[disabled]="form.invalid"` y `markAllAsTouched()` en el submit
- Timers y recursos: limpiar con `DestroyRef` (`onDestroy(() => clearTimeout(...))`, `map.remove()`)
- DOM: nunca `document.getElementById`; usar `@ViewChild` con template ref
- Sin comentarios en el código salvo que se pidan explícitamente

## Design system
- Tokens en `:root` de `src/styles.css` (`--primary`, `--surface`, `--outline-variant`, `--error`, etc.)
- Clases globales: `.material-symbols-outlined`, `.filled` (icono relleno), `.spin` (animación), `.avatar-btn`
- Fuentes: Inter (texto) y Material Symbols (iconos), cargadas en `src/index.html`
- Presupuesto de estilos por componente: 7 kB warning / 10 kB error (`angular.json`); si se excede, limpiar CSS antes de subir el budget
- Iconos con ligaduras de Material Symbols (`person`, `map`, `warning`, etc.)

## Componentes compartidos
- `app-bottom-nav` (`shared/components/bottom-nav`): tabs Noticias `/feed`, Mapa `/mapa`, Ayuda `/voluntariado`; Perfil deshabilitado hasta que exista la vista. Usa `routerLink` + `routerLinkActive`
- `app-topbar` (`shared/components/topbar`): input `title` y proyección con slots `[topbar-left]` / `[topbar-right]`

## Rutas
- Lazy loading con `loadComponent` en `app.routes.ts` (un chunk por feature)
- `/` redirige a `/feed`

## Mapa (MapLibre GL)
- `import('maplibre-gl')` dinámico dentro de `afterNextRender` (chunk lazy, no inflar el bundle inicial)
- `setWorkerUrl('maplibre-gl/maplibre-gl-worker.mjs')` antes de crear el mapa (los workers están en `public/maplibre-gl/`)
- Estilos MapTiler: `https://api.maptiler.com/maps/base-v4/style.json?key=...` (siempre con `/style.json`; sin él devuelve HTML)
- Key de MapTiler en `src/environments/environment.ts` (clave pública de cliente; nunca secretos)

## Flujo de trabajo con Stitch (MCP)
- MCP configurado en `opencode.json`; la API key vive en la variable de entorno `STITCH_API_KEY`
- Para extraer una pantalla: `list_screens` → `get_screen_code` (ver `stitch/*.html` como referencia)
- Al convertir a Angular: HTML de Stitch → template con bindings, utilidades Tailwind → CSS plano con tokens, scripts embebidos → lógica en el componente

## Verificación
- Build: `npx ng build`
- Tests: `npx ng test --watch=false --browsers=ChromeHeadless`
- Dev: `npm start` (puerto 4200)
- Siempre correr build y tests después de tocar código; ambos deben pasar sin warnings
