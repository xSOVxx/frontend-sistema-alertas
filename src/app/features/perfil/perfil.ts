import { Component, signal } from '@angular/core';
import { BottomNav } from '../../shared/components/bottom-nav/bottom-nav';
import { Topbar } from '../../shared/components/topbar/topbar';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar?: string;
}

@Component({
  selector: 'app-perfil',
  imports: [BottomNav, Topbar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  protected readonly userProfile = signal<UserProfile>({
    name: 'Juan Pérez Rodríguez',
    email: 'juan.perez@example.com',
    phone: '+51 (073) 123-4567',
    location: 'Piura, Perú',
    joinDate: 'Joined March 2024'
  });

  protected readonly isEditing = signal(false);

  protected readonly menuItems = signal([
    { icon: 'edit', label: 'Editar Perfil', action: 'edit' },
    { icon: 'notifications', label: 'Notificaciones', action: 'notifications' },
    { icon: 'help', label: 'Ayuda y Soporte', action: 'support' },
    { icon: 'info', label: 'Acerca de', action: 'about' },
    { icon: 'logout', label: 'Cerrar Sesión', action: 'logout' }
  ]);

  protected onMenuAction(action: string): void {
    switch (action) {
      case 'edit':
        this.isEditing.set(true);
        break;
      case 'logout':
        this.handleLogout();
        break;
      default:
        console.log('Action:', action);
    }
  }

  protected closeEdit(): void {
    this.isEditing.set(false);
  }

  protected handleLogout(): void {
    // TODO: Implementar lógica de logout con autenticación
    console.log('Logout');
  }
}
