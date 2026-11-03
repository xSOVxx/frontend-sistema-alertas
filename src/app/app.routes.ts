import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { adminGuard } from './core/auth/guards/admin.guard';
import { volunteerGuard } from './core/auth/guards/volunteer.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./features/feed/pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  {
    path: 'alertas/:id',
    loadComponent: () =>
      import('./features/feed/pages/alert-detail/alert-detail.component').then(
        (m) => m.AlertDetailComponent
      )
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./features/mapa/pages/mapa/mapa.component').then((m) => m.MapaComponent)
  },
  {
    path: 'monitoreo',
    loadComponent: () =>
      import('./features/monitoreo/pages/monitoreo/monitoreo.component').then(
        (m) => m.MonitoreoComponent
      )
  },
  {
    path: 'voluntariado',
    loadComponent: () =>
      import('./features/voluntariado/pages/voluntariado/voluntariado.component').then(
        (m) => m.VoluntariadoComponent
      )
  },
  {
    path: 'soporte',
    loadComponent: () =>
      import('./features/soporte/pages/soporte/soporte.component').then(
        (m) => m.SoporteComponent
      )
  },
  {
    path: 'admin/tickets',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/soporte/pages/admin-tickets/admin-tickets.component').then(
        (m) => m.AdminTicketsComponent
      )
  },
  {
    path: 'admin/metrics',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin-metrics/admin-metrics.component').then(
        (m) => m.AdminMetricsComponent
      )
  },
  {
    path: 'admin/recursos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin-resources/admin-resources.component').then(
        (m) => m.AdminResourcesComponent
      )
  },
  {
    path: 'voluntario',
    canActivate: [volunteerGuard],
    loadComponent: () =>
      import('./features/voluntario/pages/voluntario-panel/voluntario-panel.component').then(
        (m) => m.VoluntarioPanelComponent
      )
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/perfil/pages/perfil/perfil.component').then((m) => m.PerfilComponent)
  },
  {
    path: 'acerca-de',
    loadComponent: () =>
      import('./features/acerca-de/pages/acerca-de/acerca-de.component').then(
        (m) => m.AcercaDeComponent
      )
  },
  { path: '**', redirectTo: 'feed' }
];
