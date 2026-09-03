import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BottomNav } from '../../shared/components/bottom-nav/bottom-nav';
import { Topbar } from '../../shared/components/topbar/topbar';
import { AyudaService } from '../../core/services/ayuda.service';
import { GoalItem, StockItem } from '../../models/api.models';

type SubmitState = 'idle' | 'processing' | 'done';

@Component({
  selector: 'app-voluntariado',
  imports: [ReactiveFormsModule, BottomNav, Topbar],
  templateUrl: './voluntariado.html',
  styleUrl: './voluntariado.css'
})
export class Voluntariado {
  private readonly ayudaService = inject(AyudaService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly submitState = signal<SubmitState>('idle');
  protected readonly refreshing = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

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

  protected readonly stockItems = signal<StockItem[]>([]);
  protected readonly goals = signal<GoalItem[]>([]);

  protected readonly voluntarioForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
    habilidad: new FormControl('', [Validators.required])
  });

  constructor() {
    this.loadData();
  }

  protected onSubmit(): void {
    if (this.voluntarioForm.invalid) {
      this.voluntarioForm.markAllAsTouched();
      return;
    }
    this.submitState.set('processing');
    this.ayudaService.registerVolunteer({
      nombre: this.voluntarioForm.controls.nombre.value ?? '',
      dni: this.voluntarioForm.controls.dni.value ?? '',
      habilidad: this.voluntarioForm.controls.habilidad.value ?? ''
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitState.set('done');
        this.voluntarioForm.reset();
      },
      error: () => {
        this.submitState.set('idle');
        this.error.set('No se pudo registrar el voluntario.');
      }
    });
  }

  protected refreshStock(): void {
    this.refreshing.set(true);
    this.ayudaService.getStock().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (stock) => {
        this.stockItems.set(stock);
        this.refreshing.set(false);
      },
      error: () => {
        this.refreshing.set(false);
        this.error.set('No se pudo actualizar el inventario.');
      }
    });
  }

  private loadData(): void {
    forkJoin({ stock: this.ayudaService.getStock(), goals: this.ayudaService.getGoals() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.stockItems.set(data.stock);
          this.goals.set(data.goals);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar la información de ayuda.');
        }
      });
  }
}
