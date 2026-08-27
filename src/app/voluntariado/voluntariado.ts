import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBottom } from '../nav/nav';

type SubmitState = 'idle' | 'processing' | 'done';

interface StockItem {
  icon: string;
  name: string;
  stock: string;
  status: 'adecuado' | 'critico' | 'agotado';
}

interface GoalItem {
  label: string;
  percent: number;
  mono: string;
  color: string;
}

@Component({
  selector: 'app-voluntariado',
  imports: [ReactiveFormsModule, NavBottom],
  templateUrl: './voluntariado.html',
  styleUrl: './voluntariado.css'
})
export class Voluntariado {
  protected readonly submitState = signal<SubmitState>('idle');
  protected readonly refreshing = signal(false);

  private readonly destroyRef = inject(DestroyRef);

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

  protected readonly stockItems = signal<StockItem[]>([
    { icon: 'water_drop', name: 'Agua', stock: '500 L', status: 'adecuado' },
    { icon: 'shopping_basket', name: 'Canastas', stock: '120 Unidades', status: 'critico' },
    { icon: 'holiday_village', name: 'Carpas', stock: '45 Unidades', status: 'agotado' },
    { icon: 'medical_services', name: 'Kits Médicos', stock: '80 Unidades', status: 'adecuado' }
  ]);

  protected readonly goals = signal<GoalItem[]>([
    {
      label: 'Alimentos No Perecibles',
      percent: 75,
      mono: '75% (750/1000 kg)',
      color: '#002046'
    },
    {
      label: 'Fondos Emergencia Sullana',
      percent: 40,
      mono: '40% (S/. 40k/100k)',
      color: '#E67E22'
    }
  ]);

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
    this.submitState.set('processing');
    const doneTimer = setTimeout(() => {
      this.submitState.set('done');
      const resetTimer = setTimeout(() => {
        this.voluntarioForm.reset();
        this.submitState.set('idle');
      }, 2000);
      this.destroyRef.onDestroy(() => clearTimeout(resetTimer));
    }, 1000);
    this.destroyRef.onDestroy(() => clearTimeout(doneTimer));
  }

  protected refreshStock(): void {
    this.refreshing.set(true);
    const timer = setTimeout(() => this.refreshing.set(false), 1000);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }
}
