import { Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { AyudaService } from '../../services/ayuda.service';
import { GoalItem, StockItem, VolunteerRequest } from '../../models/voluntariado.model';
import { VolunteerFormComponent, SubmitState } from '../../components/volunteer-form/volunteer-form.component';
import { StockInventoryComponent } from '../../components/stock-inventory/stock-inventory.component';
import { DonationGoalsComponent } from '../../components/donation-goals/donation-goals.component';
import { SolicitarAyudaModalComponent } from '../../components/solicitar-ayuda/solicitar-ayuda-modal.component';

@Component({
  selector: 'app-voluntariado',
  imports: [
    TopbarComponent,
    BottomNavComponent,
    VolunteerFormComponent,
    StockInventoryComponent,
    DonationGoalsComponent,
    SolicitarAyudaModalComponent
  ],
  templateUrl: './voluntariado.component.html',
  styleUrl: './voluntariado.component.css'
})
export class VoluntariadoComponent {
  private readonly ayudaService = inject(AyudaService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(VolunteerFormComponent)
  private readonly volunteerFormComponent?: VolunteerFormComponent;

  protected readonly submitState = signal<SubmitState>('idle');
  protected readonly refreshing = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly stockItems = signal<StockItem[]>([]);
  protected readonly goals = signal<GoalItem[]>([]);

  // Modal para que el damnificado pida auxilio
  protected readonly showHelpModal = signal(false);

  constructor() {
    this.loadData();
  }

  protected onRegister(request: VolunteerRequest): void {
    this.submitState.set('processing');
    this.ayudaService.registerVolunteer(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitState.set('done');
        this.volunteerFormComponent?.reset();
        setTimeout(() => this.submitState.set('idle'), 4000);
      },
      error: () => {
        this.submitState.set('idle');
        this.error.set('No se pudo registrar el voluntario.');
      }
    });
  }

  protected onRefreshStock(): void {
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
