# FrontendSistemaAlertas

Frontend del sistema de alertas **PonteAlerta Piura**, generado con [Angular CLI](https://github.com/angular/angular-cli) 20.3.8 (Angular 20, standalone components + signals).

## Requisitos

- **Node.js 22** (requerido). Con nvm:

```bash
nvm install 22
nvm use 22
```

- Dependencias:

```bash
npm install
```

## Servidor de desarrollo

```bash
npm start
```

Abrir `http://localhost:4200/`. La aplicación recarga automáticamente al modificar los archivos.

## Rutas

| Ruta           | Vista                      |
| -------------- | -------------------------- |
| `/`            | Redirige a `/feed`         |
| `/feed`        | Feed de alertas y noticias |
| `/mapa`        | Mapa de emergencias        |
| `/voluntariado`| Voluntariado y donaciones  |
| `/login`       | Inicio de sesión           |

## Compilación

```bash
npm run build
```

Los artefactos se generan en `dist/`. Por defecto la build de producción optimiza la aplicación.

## Generar código (scaffolding)

Angular CLI incluye herramientas de scaffolding. Para generar un componente:

```bash
ng generate component nombre-componente
```

Otras generaciones útiles:

```bash
ng generate service core/services/nombre
ng generate interface models/nombre
ng generate directive shared/directives/nombre
ng generate pipe shared/pipes/nombre
```

Para la lista completa de schematics (componentes, servicios, guards, interceptors, etc.):

```bash
ng generate --help
```

Sugerencia: los componentes reutilizables van en `src/app/shared/components/` y las pantallas en `src/app/features/`.

## Tests unitarios

```bash
npm test
```

Ejecutados con [Karma](https://karma-runner.github.io) y Jasmine (headless): `npx ng test --watch=false --browsers=ChromeHeadless`.

## Tests end-to-end

El proyecto no incluye un framework e2e por defecto. Para agregarlo, Angular CLI ofrece `ng e2e` una vez configurado un framework como Cypress o Playwright.

## Estructura

```
src/app/
├── shared/components/    # componentes reutilizables (bottom-nav, topbar)
├── features/             # una carpeta por pantalla
├── environments/         # claves públicas de cliente
stitch/                   # HTML de referencia extraído de Stitch (MCP)
```

Para más detalle sobre las prácticas del proyecto, ver las skills en `.opencode/skills/`.

## Recursos

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
