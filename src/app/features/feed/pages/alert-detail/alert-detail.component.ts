import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { AlertItem } from '../../models/alert.model';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-alert-detail',
  imports: [RouterLink, TopbarComponent, BottomNavComponent],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.css'
})
export class AlertDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly alertasService = inject(AlertasService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly alert = signal<AlertItem | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.error.set('Alerta no encontrada.');
      return;
    }

    this.alertasService
      .getAlert(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (alert) => {
          this.alert.set(alert);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar la alerta.');
        }
      });
  }
}
