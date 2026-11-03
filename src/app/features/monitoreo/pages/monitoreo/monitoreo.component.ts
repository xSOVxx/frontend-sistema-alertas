import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import {
  EarthquakeEvent,
  SeismicRiskPrediction,
  WeatherCurrent,
  WeatherForecast
} from '../../models/monitoreo.model';
import { MonitoreoService } from '../../services/monitoreo.service';

@Component({
  selector: 'app-monitoreo',
  imports: [TopbarComponent, BottomNavComponent],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent {
  private readonly monitoreoService = inject(MonitoreoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly latitude = -5.1945;
  protected readonly longitude = -80.6328;
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly current = signal<WeatherCurrent | null>(null);
  protected readonly forecast = signal<WeatherForecast[]>([]);
  protected readonly earthquakes = signal<EarthquakeEvent[]>([]);
  protected readonly risk = signal<SeismicRiskPrediction | null>(null);

  constructor() {
    this.loadData();
  }

  protected loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      current: this.monitoreoService.getCurrentWeather(this.latitude, this.longitude),
      forecast: this.monitoreoService.getForecast(this.latitude, this.longitude),
      earthquakes: this.monitoreoService.getRecentEarthquakes(),
      risk: this.monitoreoService.getSeismicRisk('Piura')
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.current.set(data.current);
          this.forecast.set(data.forecast.slice(0, 5));
          this.earthquakes.set(data.earthquakes.slice(0, 6));
          this.risk.set(data.risk);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar la información de monitoreo.');
        }
      });
  }

  protected riskLabel(level?: string): string {
    const labels: Record<string, string> = {
      bajo: 'Bajo',
      moderado: 'Moderado',
      alto: 'Alto',
      critico: 'Crítico'
    };
    return labels[level ?? ''] ?? 'Sin dato';
  }

  protected formatDate(value?: string): string {
    if (!value) return 'Sin fecha';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
  }
}
