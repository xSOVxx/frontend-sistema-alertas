import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BottomNav } from '../../shared/components/bottom-nav/bottom-nav';
import { Topbar } from '../../shared/components/topbar/topbar';
import { PerfilService } from '../../core/services/perfil.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../models/api.models';

@Component({
  selector: 'app-perfil',
  imports: [BottomNav, Topbar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly userProfile = signal<UserProfile>({ id: '', name: '', email: '' });
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly isEditing = signal(false);

  protected readonly menuItems = signal([
    { icon: 'edit', label: 'Editar Perfil', action: 'edit' },
    { icon: 'notifications', label: 'Notificaciones', action: 'notifications' },
    { icon: 'help', label: 'Ayuda y Soporte', action: 'support' },
    { icon: 'info', label: 'Acerca de', action: 'about' },
    { icon: 'logout', label: 'Cerrar Sesión', action: 'logout' }
  ]);

  constructor() {
    this.loadProfile();
  }

  protected loadProfile(): void {
    this.loading.set(true);
    this.perfilService.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo cargar el perfil.');
      }
    });
  }

  protected onMenuAction(action: string): void {
    switch (action) {
      case 'edit':
        this.isEditing.set(true);
        break;
      case 'logout':
        this.handleLogout();
        break;
      default:
        this.error.set('Esta opción estará disponible próximamente.');
    }
  }

  protected closeEdit(): void {
    this.isEditing.set(false);
  }

  protected handleLogout(): void {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/login']),
      error: () => {
        this.error.set('No se pudo cerrar sesión.');
      }
    });
  }
}
