import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  disabled: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  protected readonly items = signal<NavItem[]>([
    { icon: 'newspaper', label: 'Noticias', route: '/feed', disabled: false },
    { icon: 'map', label: 'Mapa', route: '/mapa', disabled: false },
    { icon: 'volunteer_activism', label: 'Ayuda', route: '/voluntariado', disabled: false },
    { icon: 'support_agent', label: 'Soporte', route: '/soporte', disabled: false },
    { icon: 'person', label: 'Perfil', route: '/perfil', disabled: false }
  ]);
}
