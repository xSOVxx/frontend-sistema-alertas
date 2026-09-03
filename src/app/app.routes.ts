import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./features/feed/feed').then((m) => m.Feed)
  },
  {
    path: 'mapa',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mapa/mapa').then((m) => m.Mapa)
  },
  {
    path: 'voluntariado',
    canActivate: [authGuard],
    loadComponent: () => import('./features/voluntariado/voluntariado').then((m) => m.Voluntariado)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/perfil/perfil').then((m) => m.Perfil)
  }
];
