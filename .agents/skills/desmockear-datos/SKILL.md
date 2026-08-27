---
name: desmockear-datos
description: Use when removing mock/hardcoded data from this Angular project and wiring real API data: replacing signals with mock data, fake setTimeout behaviors, and placeholder handlers with services, HTTP calls, models, and loading/error states.
---

# Desmockear datos en frontend-sistema-alertas

Proceso para reemplazar datos y comportamientos mockeados por datos reales de una API.

## 1. Localizar los mocks
Datos hardcodeados actuales (marcadores típicos: `signal([...])` con contenido fijo, `setTimeout` que simula procesos, botones sin handler):
- `features/feed/feed.ts` → `alerts` (tarjetas de alertas)
- `features/voluntariado/voluntariado.ts` → `stockItems`, `goals`, y `setTimeout` en `onSubmit`/`refreshStock`
- `features/mapa/mapa.ts` → `shelters`, `blockedRoads`, `floodZones`
- `shared/components/bottom-nav/bottom-nav.ts` → `items` (si algún día vienen de configuración)
- Handlers vacíos: botones de tarjetas en feed, FAB de reportar, "Olvidé mi contraseña" en login

## 2. Definir el contrato de datos
- Crear interfaces en `src/app/models/` (una carpeta por dominio: `models/alerta.ts`, `models/stock.ts`...)
- Mover las interfaces locales del componente a `models/` cuando el servicio las comparta
- Los nombres y tipos deben reflejar la respuesta real del backend, no la forma del mock

## 3. Crear el servicio
- Ubicación: `src/app/core/services/<dominio>.service.ts`
- Standalone con `@Injectable({ providedIn: 'root' })`, inyectar `HttpClient`
- Métodos por operación (`getAlertas()`, `registrarVoluntario()`, `getStock()`) devolviendo `Observable<T>` tipado

## 4. Configurar HTTP
- En `app.config.ts`: `provideHttpClient(withFetch())`
- Agregar `apiBaseUrl` a `src/environments/environment.ts` (nunca hardcodear la URL base en el servicio)

## 5. Consumir en el componente
- Signal inicial vacía + carga en el ciclo de vida (`afterNextRender` o constructor)
- Estado de carga/error: señales `loading` y `error` con UI de fallback (no dejar pantalla en blanco)
- Suscripciones con `takeUntilDestroyed()` o `DestroyRef` para no filtrar memoria
- Reemplazar los `setTimeout` que simulaban submit/refresh por llamadas reales al servicio (éxito/error con estados de botón reales)
- Eliminar `console.log` residuales y datos de prueba

## 6. Actualizar tests
- Los specs de componentes que consuman el servicio deben mockearlo (spy de Jasmine con `createSpyObj` o `TestBed.overrideProvider`)
- Cubrir estados: datos cargados, loading, error
- Verificar: `npx ng build` y `npx ng test --watch=false --browsers=ChromeHeadless` sin warnings

## Reglas
- No dejar datos de ejemplo tras desmockear; si falta backend, dejar el mock en un archivo `*.mock.ts` separado y documentado, nunca mezclado con la lógica
- Un servicio por dominio; no meter llamadas HTTP directas en componentes
