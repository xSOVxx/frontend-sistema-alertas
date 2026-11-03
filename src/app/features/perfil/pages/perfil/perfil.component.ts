import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { AuthService } from '@core/auth/services/auth.service';
import { SessionService } from '@core/auth/services/session.service';
import { PerfilService } from '../../services/perfil.service';
import { UserProfile, ProfileMenuItem } from '../../models/perfil.model';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, TopbarComponent, BottomNavComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly userProfile = signal<UserProfile>({ id: '', name: '', email: '' });
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditing = signal(false);
  protected readonly saving = signal(false);

  protected readonly editForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^\d{9}$/)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] })
  });

  protected readonly menuItems = signal<ProfileMenuItem[]>([
    ...(this.session.isAdmin()
      ? [{ icon: 'confirmation_number', label: 'Bandeja de tickets', action: 'admin-tickets' }]
      : []),
    { icon: 'edit', label: 'Editar Perfil', action: 'edit' },
    { icon: 'support_agent', label: 'Ayuda y Soporte', action: 'support' },
    { icon: 'notifications', label: 'Notificaciones', action: 'notifications' },
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
        this.editForm.patchValue({
          name: profile.name,
          phone: profile.phone ?? '',
          location: profile.location ?? ''
        });
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
      case 'support':
        void this.router.navigate(['/soporte']);
        break;
      case 'admin-tickets':
        void this.router.navigate(['/admin/tickets']);
        break;
      case 'about':
        void this.router.navigate(['/acerca-de']);
        break;
      case 'logout':
        this.handleLogout();
        break;
      default:
        this.error.set('Esta opción estará disponible próximamente.');
    }
  }

  protected saveProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.editForm.getRawValue();

    this.perfilService
      .updateProfile({
        name: value.name,
        phone: value.phone,
        location: value.location
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.userProfile.set(profile);
          this.session.updateUser({
            ...profile,
            name: profile.name,
            email: profile.email
          });
          this.saving.set(false);
          this.isEditing.set(false);
        },
        error: () => {
          this.saving.set(false);
          this.error.set('No se pudo actualizar el perfil.');
        }
      });
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
