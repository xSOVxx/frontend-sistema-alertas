import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { AlertCardComponent } from '../../components/alert-card/alert-card.component';
import { SolicitarAyudaModalComponent } from '@features/voluntariado/components/solicitar-ayuda/solicitar-ayuda-modal.component';
import { AlertItem } from '../../models/alert.model';
import { AlertasService } from '../../services/alertas.service';
import { NetworkStatusService } from '@core/services/network-status.service';

@Component({
  selector: 'app-feed',
  imports: [
    RouterLink,
    TopbarComponent,
    BottomNavComponent,
    AlertCardComponent,
    SolicitarAyudaModalComponent
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  private readonly alertasService = inject(AlertasService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly network = inject(NetworkStatusService);

  protected readonly searchQuery = signal('');
  protected readonly selectedKind = signal<string | null>(null);
  protected readonly alerts = signal<AlertItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly syncing = signal(false);
  protected readonly syncMessage = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  // Estado del modal de solicitud de ayuda para damnificados
  protected readonly showHelpModal = signal(false);

  // Indica si las alertas actuales provienen de la caché offline
  protected readonly isUsingOfflineCache = computed(() => {
    return typeof this.alertasService?.isUsingOfflineCache === 'function'
      ? this.alertasService.isUsingOfflineCache()
      : false;
  });

  constructor() {
    this.loadAlerts();

    // Auto-refrescar cuando se restablezca la conexión a internet
    this.network.reconnected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadAlerts();
      });
  }

  protected readonly filteredAlerts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
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

  protected setFilter(kind: string | null): void {
    this.selectedKind.set(this.selectedKind() === kind ? null : kind);
  }

  protected loadAlerts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.alertasService
      .getAlerts(this.searchQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (alerts) => {
          this.alerts.set(alerts);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar las alertas desde el servidor backend.');
        }
      });
  }

  /**
   * Ejecuta manualmente el scraping del COER en el backend
   * y recarga las alertas para visualizarlas en tiempo real.
   */
  protected ejecutarScraping(): void {
    if (!this.network.isOnline()) {
      this.syncMessage.set('Sin conexión a internet. No se puede sincronizar en este momento.');
      setTimeout(() => this.syncMessage.set(null), 3000);
      return;
    }

    this.syncing.set(true);
    this.syncMessage.set('Sincronizando reportes oficiales del COER Piura...');

    this.alertasService
      .triggerCoerScraping()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.syncing.set(false);
          this.syncMessage.set(res.message || 'Scraping completado');
          this.loadAlerts();
          setTimeout(() => this.syncMessage.set(null), 3500);
        },
        error: () => {
          this.syncing.set(false);
          this.syncMessage.set('Error al conectar con el servicio de scraping');
          setTimeout(() => this.syncMessage.set(null), 3500);
        }
      });
  }

  protected openAlert(alert: AlertItem): void {
    void this.router.navigate(['/mapa'], { queryParams: { alertId: alert.id } });
  }

  protected onHelpSubmitted(): void {
    this.loadAlerts();
  }
}
