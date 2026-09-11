import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./features/feed/pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./features/mapa/pages/mapa/mapa.component').then((m) => m.MapaComponent)
  },
  {
    path: 'voluntariado',
    loadComponent: () =>
      import('./features/voluntariado/pages/voluntariado/voluntariado.component').then(
        (m) => m.VoluntariadoComponent
      )
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/pages/perfil/perfil.component').then((m) => m.PerfilComponent)
  },
  { path: '**', redirectTo: 'feed' }
];
