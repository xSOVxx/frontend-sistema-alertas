import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopbarComponent, BottomNavComponent } from '@shared/index';

@Component({
  selector: 'app-acerca-de',
  imports: [RouterLink, TopbarComponent, BottomNavComponent],
  template: `
    <div class="page">
      <app-topbar>
        <span topbar-left class="brand">
          <span class="material-symbols-outlined">info</span>
          Acerca de
        </span>
      </app-topbar>
      <main class="main">
        <section class="card">
          <h1>PonteAlerta Piura</h1>
          <p>
            Sistema de gestión de emergencias para la Región Piura. Centraliza alertas del COER,
            reportes ciudadanos, refugios, inventario de ayuda y un canal de soporte para la
            aplicación.
          </p>
          <dl>
            <div><dt>Versión</dt><dd>1.0</dd></div>
            <div><dt>Región</dt><dd>Piura, Perú</dd></div>
            <div><dt>Stack</dt><dd>Angular 20 + NestJS + PostgreSQL + Keycloak</dd></div>
            <div><dt>Soporte</dt><dd>Módulo ITSM propio con catálogo y SLA</dd></div>
          </dl>
          <a class="link" routerLink="/soporte">Ir a la mesa de ayuda</a>
        </section>
      </main>
      <app-bottom-nav />
    </div>
  `,
  styles: [
    `
      :host { display: block; min-height: 100vh; background: var(--background); }
      .page { min-height: 100vh; padding-bottom: 96px; font-family: 'Inter', sans-serif; }
      .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--primary); }
      .main { max-width: 720px; margin: 0 auto; padding: 20px 16px; }
      .card { padding: 24px; background: var(--surface); border: 1px solid var(--outline-variant); border-radius: 14px; }
      h1 { margin: 0 0 12px; color: var(--primary); }
      p { color: var(--on-surface-variant); line-height: 1.6; }
      dl { display: grid; gap: 10px; margin: 20px 0; }
      dl div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--outline-variant); padding-bottom: 8px; }
      dt { color: var(--on-surface-variant); font-size: 12px; text-transform: uppercase; }
      dd { margin: 0; font-size: 13px; font-weight: 600; }
      .link { display: inline-block; padding: 10px 14px; background: var(--primary); color: #fff; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
    `
  ]
})
export class AcercaDeComponent {}
