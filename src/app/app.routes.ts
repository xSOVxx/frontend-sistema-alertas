import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Feed } from './feed/feed';
import { Mapa } from './mapa/mapa';
import { Voluntariado } from './voluntariado/voluntariado';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'feed', component: Feed },
  { path: 'mapa', component: Mapa },
  { path: 'voluntariado', component: Voluntariado }
];
