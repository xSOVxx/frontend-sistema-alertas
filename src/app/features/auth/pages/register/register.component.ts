import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';

const PASSWORD_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly registerForm = new FormGroup(
    {
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.pattern(/^\d{9}$/)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(PASSWORD_SPECIAL)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    { validators: passwordMatch }
  );

  protected get passwordValue(): string {
    return this.registerForm.controls.password.value ?? '';
  }

  protected hasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  protected hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  protected hasSpecial(): boolean {
    return PASSWORD_SPECIAL.test(this.passwordValue);
  }

  protected togglePassword(): void {
    this.hidePassword.update((value) => !value);
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { fullName, email, phone, password } = this.registerForm.getRawValue();

    this.authService
      .register({
        fullName: fullName ?? '',
        email: (email ?? '').trim().toLowerCase(),
        phone: phone || undefined,
        password: password ?? ''
      })
      .subscribe({
        next: () => {
          this.authService
            .login({ email: (email ?? '').trim().toLowerCase(), password: password ?? '' })
            .subscribe({
              next: () => {
                this.loading.set(false);
                void this.router.navigate(['/feed']);
              },
              error: () => {
                this.loading.set(false);
                void this.router.navigate(['/login']);
              }
            });
        },
        error: (err) => {
          this.loading.set(false);
          const detail = err?.error?.message;
          this.error.set(
            Array.isArray(detail)
              ? detail.join('. ')
              : detail || 'No se pudo crear la cuenta. Verifica los datos.'
          );
        }
      });
  }
}
