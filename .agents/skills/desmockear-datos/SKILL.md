---
name: desmockear-datos
description: Use when removing mock or hardcoded data from this Angular project and wiring real API data: replacing signals with mock data, fake setTimeout behaviors and placeholder handlers with services, HTTP calls, models and loading/error states.
---

# Desmockear datos en frontend-sistema-alertas

Proceso para reemplazar datos y comportamientos mockeados por datos reales del backend.

## 1. Localizar los mocks

Marcadores típicos: `signal([...])` con contenido fijo, `setTimeout` que simula procesos,
botones sin handler y arrays declarados dentro del componente.

Puntos donde suelen aparecer:

- `features/feed/pages/feed/feed.component.ts` → lista de alertas.
- `features/mapa/pages/mapa/mapa.component.ts` → `shelters`, `blockedRoads`, `floodZones`.
- `features/voluntariado/pages/voluntariado/voluntariado.component.ts` → `stockItems`, `goals`,
  y `setTimeout` en `onSubmit`/`refreshStock`.
- `features/perfil/pages/perfil/perfil.component.ts` → perfil de ejemplo.
- `features/monitoreo/pages/monitoreo/monitoreo.component.ts` → clima o sismos fijos.
- `features/soporte/pages/soporte/soporte.component.ts` → catálogo o tickets de ejemplo.
- Handlers vacíos: botones de tarjetas, FAB de reportar, acciones del menú de perfil.

Verificar antes con:

```bash
rg "signal\(\[|setTimeout|mock|hardcode" src/app/features
```

## 2. Definir el contrato de datos

- Modelos en `features/<feature>/models/<dominio>.model.ts`.
- Los tipos deben reflejar la respuesta real del backend, no la forma del mock.
- Si el modelo lo comparten varias features, moverlo a `core/models/`.
- Reutilizar enums y uniones (`'RED' | 'YELLOW' | 'GREEN'`, estados de ticket, etc.).

```ts
export interface Alerta {
  id: string;
  title: string;
  content: string;
  severity: 'RED' | 'YELLOW' | 'GREEN';
  createdAt: string;
}
```

## 3. Registrar el endpoint

Toda ruta del backend se declara en `core/api/api-endpoints.ts`:

```ts
export const API_ENDPOINTS = {
  alerts: {
    list: '/alerts',
    detail: (id: string) => `/alerts/${id}`
  }
};
```

Nunca escribir la ruta completa dentro del servicio.

## 4. Crear el servicio

- Ubicación: `features/<feature>/services/<dominio>.service.ts`.
- Si es transversal: `core/services/`.
- `@Injectable({ providedIn: 'root' })`, inyectar `HttpClient`.
- Un método por operación, devolviendo `Observable<T>` tipado.
- Construir la URL con `environment.apiBaseUrl + API_ENDPOINTS...`.
- El `authInterceptor` ya agrega el `Bearer`; no manejarlo a mano.

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { Alerta } from '../models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  listar(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.base}${API_ENDPOINTS.alerts.list}`);
  }

  detalle(id: string): Observable<Alerta> {
    return this.http.get<Alerta>(`${this.base}${API_ENDPOINTS.alerts.detail(id)}`);
  }
}
```

## 5. Consumir en el componente

- Signal inicial `null` o `[]`, nunca datos de ejemplo.
- Estados `loading` y `error` con UI de fallback; no dejar pantalla en blanco.
- Suscripción con `takeUntilDestroyed(this.destroyRef)`.
- Reemplazar `setTimeout` por la llamada real y estados reales del botón.
- Eliminar `console.log` y datos de prueba.

```ts
protected readonly alertas = signal<Alerta[]>([]);
protected readonly loading = signal(true);
protected readonly error = signal<string | null>(null);

constructor() {
  this.alertasService
    .listar()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.alertas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las alertas.');
        this.loading.set(false);
      }
    });
}
```

## 6. Actualizar el template

```html
@if (loading()) {
  <div class="loading">
    <span class="material-symbols-outlined spin">sync</span>
    <p>Cargando...</p>
  </div>
} @else if (error()) {
  <div class="error-state">
    <span class="material-symbols-outlined">error</span>
    <p>{{ error() }}</p>
    <button type="button" (click)="recargar()">Reintentar</button>
  </div>
} @else {
  @for (item of alertas(); track item.id) {
    <!-- contenido real -->
  }
}
```

## 7. Actualizar tests

- Mockear el servicio con `jasmine.createSpyObj` o `TestBed.overrideProvider`.
- Cubrir tres estados: datos cargados, loading y error.
- No dejar pruebas que dependan del mock eliminado.
- Verificar:

```bash
npx ng build
npx ng test --watch=false --browsers=ChromeHeadless
```

## Reglas

- No dejar datos de ejemplo tras desmockear.
- Si el backend aún no existe, aislar el mock en `*.mock.ts` y documentarlo; nunca mezclarlo con la lógica.
- Un servicio por dominio; prohibido llamar `HttpClient` desde un componente.
- Tipificar todas las respuestas.
- Reutilizar `API_ENDPOINTS`; prohibido duplicar rutas.
- Respetar los guards: si la ruta requiere ADMIN, el servicio no debe usarse desde una vista pública.

## Checklist

- [ ] Mock eliminado del componente.
- [ ] Modelo creado y tipado.
- [ ] Endpoint agregado a `API_ENDPOINTS`.
- [ ] Servicio con métodos tipados.
- [ ] Estados loading y error.
- [ ] `takeUntilDestroyed` aplicado.
- [ ] Tests actualizados.
- [ ] Build y tests en verde.
