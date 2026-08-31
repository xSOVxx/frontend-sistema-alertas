---
name: desmockear-datos
description: Use when removing mock/hardcoded data from this Angular project and wiring real API data: replacing signals with mock data, fake setTimeout behaviors, and placeholder handlers with services, HTTP calls, models, and loading/error states.
---

# Desmockear datos en frontend-sistema-alertas

Proceso para reemplazar datos y comportamientos mockeados por datos reales de una API.

## 1. Localizar los mocks
Datos hardcodeados actuales (marcadores típicos: `signal([...])` con contenido fijo, `setTimeout` que simula procesos, botones sin handler):
- `features/feed/feed.ts` → `alerts` (tarjetas de alertas con tres elementos de ejemplo)
- `features/voluntariado/voluntariado.ts` → `stockItems`, `goals`, y `setTimeout` en `onSubmit`/`refreshStock` (~1s delay)
- `features/mapa/mapa.ts` → `shelters`, `blockedRoads`, `floodZones` (datos de prueba)
- `features/perfil/perfil.ts` → `userProfile` (datos de usuario ejemplo "Juan Pérez Rodríguez"), menú de acciones sin funcionalidad
- `shared/components/bottom-nav/bottom-nav.ts` → `items` (si algún día vienen de configuración remota)
- Handlers vacíos: botones de tarjetas en feed, FAB de reportar, "Olvidé mi contraseña" en login, acciones del menú de perfil

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
- Siempre tipificar las respuestas HTTP con interfaces en `models/`

## Ejemplo práctico: Desmockear perfil de usuario

### Antes (mock)
```typescript
// features/perfil/perfil.ts
export class Perfil {
  protected readonly userProfile = signal<UserProfile>({
    name: 'Juan Pérez Rodríguez',
    email: 'juan.perez@example.com',
    phone: '+51 (073) 123-4567',
    location: 'Piura, Perú',
    joinDate: 'Joined March 2024'
  });
}
```

### Después (con API)
1. Crear modelo en `src/app/models/usuario.ts`:
```typescript
export interface UsuarioPerfil {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: string;
  fechaRegistro: Date;
}
```

2. Crear servicio en `src/app/core/services/usuario.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioPerfil } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<UsuarioPerfil> {
    return this.http.get<UsuarioPerfil>(`${environment.apiBaseUrl}/usuario/perfil`);
  }

  actualizarPerfil(datos: Partial<UsuarioPerfil>): Observable<UsuarioPerfil> {
    return this.http.patch<UsuarioPerfil>(`${environment.apiBaseUrl}/usuario/perfil`, datos);
  }

  cerrarSesion(): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/logout`, {});
  }
}
```

3. Consumir en componente `features/perfil/perfil.ts`:
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioPerfil } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  imports: [BottomNav, Topbar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  protected readonly userProfile = signal<UsuarioPerfil | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usuarioService
      .obtenerPerfil()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (perfil) => {
          this.userProfile.set(perfil);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error al cargar el perfil. Intenta más tarde.');
          this.loading.set(false);
          console.error('Error cargando perfil:', err);
        }
      });
  }

  protected cerrarSesion(): void {
    this.usuarioService
      .cerrarSesion()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          // Redirigir a login o limpiar autenticación
          console.log('Sesión cerrada');
        },
        error: (err) => {
          this.error.set('Error al cerrar sesión.');
          console.error('Error:', err);
        }
      });
  }
}
```

4. Actualizar template para mostrar estados:
```html
@if (loading()) {
  <div class="loading">
    <span class="material-symbols-outlined spin">sync</span>
    <p>Cargando perfil...</p>
  </div>
} @else if (error()) {
  <div class="error-state">
    <span class="material-symbols-outlined">error</span>
    <p>{{ error() }}</p>
    <button (click)="cargarPerfil()">Reintentar</button>
  </div>
} @else if (userProfile()) {
  <!-- Contenido del perfil -->
}
```

5. Agregar `apiBaseUrl` a `src/environments/environment.ts`:
```typescript
export const environment = {
  apiBaseUrl: 'https://api.ejemplo.com/v1'
};
```
