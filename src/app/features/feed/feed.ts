import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BottomNav } from '../../shared/components/bottom-nav/bottom-nav';
import { Topbar } from '../../shared/components/topbar/topbar';
import { AlertItem } from '../../models/api.models';
import { AlertasService } from '../../core/services/alertas.service';

@Component({
  selector: 'app-feed',
  imports: [BottomNav, Topbar],
  templateUrl: './feed.html',
  styleUrl: './feed.css'
})
export class Feed {
  private readonly alertasService = inject(AlertasService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchQuery = signal('');
  protected readonly selectedKind = signal<string | null>(null);
  protected readonly alerts = signal<AlertItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadAlerts();
  }

  protected readonly filteredAlerts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.alerts();
    }
    return this.alerts().filter((alert) => {
      const matchesQuery = `${alert.title} ${alert.label} ${alert.description ?? ''}`
        .toLowerCase()
        .includes(query);
      return matchesQuery && (!this.selectedKind() || alert.kind === this.selectedKind());
    });
  });

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  protected toggleFilter(): void {
    const kinds = [null, 'roja', 'precaucion', 'informacion'] as const;
    const index = kinds.indexOf(this.selectedKind() as (typeof kinds)[number]);
    this.selectedKind.set(kinds[(index + 1) % kinds.length]);
  }

  protected loadAlerts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.alertasService.getAlerts(this.searchQuery()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las alertas.');
      }
    });
  }

  protected openAlert(alert: AlertItem): void {
    void this.router.navigate(['/mapa'], { queryParams: { alertId: alert.id } });
  }
}
