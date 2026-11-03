import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopbarComponent, BottomNavComponent } from '@shared/index';

@Component({
  selector: 'app-voluntario-panel',
  imports: [RouterLink, TopbarComponent, BottomNavComponent],
  template: `
    <div class="page">
      <app-topbar>
        <span topbar-left class="brand">
          <span class="material-symbols-outlined">volunteer_activism</span>
          Panel de voluntario
        </span>
      </app-topbar>

      <main class="main">
        <section class="card">
          <div class="icon">
            <span class="material-symbols-outlined filled">engineering</span>
          </div>
          <p class="eyebrow">Acceso desbloqueado</p>
          <h1>Próximamente</h1>
          <p>
            Estamos preparando las herramientas para voluntarios: asignación de
            brigadas, rutas de entrega, control de ayuda y tareas de campo.
          </p>
          <a class="link" routerLink="/voluntariado">Volver a voluntariado</a>
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
      .main { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
      .card { padding: 32px 24px; text-align: center; background: var(--surface); border: 1px solid var(--outline-variant); border-radius: 18px; box-shadow: var(--shadow-md); }
      .icon { display: flex; align-items: center; justify-content: center; width: 76px; height: 76px; margin: 0 auto 18px; background: var(--primary-container); color: var(--on-primary-container); border-radius: 20px; }
      .icon .material-symbols-outlined { font-size: 40px; }
      .eyebrow { margin: 0; color: #15803d; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
      h1 { margin: 8px 0; color: var(--primary); font-size: 30px; }
      p { margin: 0 auto 20px; max-width: 440px; color: var(--on-surface-variant); font-size: 14px; line-height: 1.6; }
      .link { display: inline-block; padding: 10px 16px; background: var(--primary); color: #fff; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
    `
  ]
})
export class VoluntarioPanelComponent {}
