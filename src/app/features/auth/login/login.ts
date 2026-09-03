import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  protected togglePassword(): void {
    this.hidePassword.update((value) => !value);
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.authService.login({
      email: this.loginForm.controls.email.value ?? '',
      password: this.loginForm.controls.password.value ?? ''
    }).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/feed']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo iniciar sesión. Verifica tus credenciales.');
      }
    });
  }

  protected onForgotPassword(event: Event): void {
    event.preventDefault();
    const email = this.loginForm.controls.email;
    if (email.invalid) {
      email.markAsTouched();
      this.error.set('Ingresa un correo válido para recuperar tu contraseña.');
      return;
    }
    this.authService.forgotPassword(email.value ?? '').subscribe({
      next: () => this.error.set('Si el correo existe, recibirás instrucciones para recuperar tu contraseña.'),
      error: () => this.error.set('No se pudo solicitar la recuperación de contraseña.')
    });
  }
}
