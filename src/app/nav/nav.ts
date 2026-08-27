import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  disabled: boolean;
}

@Component({
  selector: 'app-nav-bottom',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class NavBottom {
  protected readonly items = signal<NavItem[]>([
    { icon: 'newspaper', label: 'Noticias', route: '/feed', disabled: false },
    { icon: 'map', label: 'Mapa', route: '/mapa', disabled: false },
    { icon: 'volunteer_activism', label: 'Ayuda', route: '/voluntariado', disabled: false },
    { icon: 'person', label: 'Perfil', route: '', disabled: true }
  ]);
}
