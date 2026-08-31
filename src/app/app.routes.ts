import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/feed').then((m) => m.Feed)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./features/mapa/mapa').then((m) => m.Mapa)
  },
  {
    path: 'voluntariado',
    loadComponent: () => import('./features/voluntariado/voluntariado').then((m) => m.Voluntariado)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/perfil/perfil').then((m) => m.Perfil)
  }
];
