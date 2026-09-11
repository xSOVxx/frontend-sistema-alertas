import { Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VolunteerRequest } from '../../models/voluntariado.model';

export type SubmitState = 'idle' | 'processing' | 'done';

@Component({
  selector: 'app-volunteer-form',
  imports: [ReactiveFormsModule],
  templateUrl: './volunteer-form.component.html',
  styleUrl: './volunteer-form.component.css'
})
export class VolunteerFormComponent {
  readonly submitState = input<SubmitState>('idle');
  readonly register = output<VolunteerRequest>();

  protected readonly submitLabel = computed(() => {
    switch (this.submitState()) {
      case 'processing':
        return 'Procesando...';
      case 'done':
        return 'Registrado';
      default:
        return 'Registrar Voluntario';
    }
  });

  protected readonly submitIcon = computed(() => {
    switch (this.submitState()) {
      case 'processing':
        return 'sync';
      case 'done':
        return 'check_circle';
      default:
        return 'how_to_reg';
    }
  });

  protected readonly voluntarioForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
    habilidad: new FormControl('', [Validators.required])
  });

  protected onSubmit(): void {
    if (this.voluntarioForm.invalid) {
      this.voluntarioForm.markAllAsTouched();
      return;
    }
    this.register.emit({
      nombre: this.voluntarioForm.controls.nombre.value ?? '',
      dni: this.voluntarioForm.controls.dni.value ?? '',
      habilidad: this.voluntarioForm.controls.habilidad.value ?? ''
    });
  }

  reset(): void {
    this.voluntarioForm.reset();
  }
}
