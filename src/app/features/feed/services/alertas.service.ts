import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { AlertItem, AlertKind } from '../models/alert.model';

export interface ScrapingSyncResponse {
  success: boolean;
  message: string;
  count?: number;
}

const OFFLINE_ALERTS_KEY = 'pontealerta_offline_alerts';
const LAST_SYNC_KEY = 'pontealerta_alerts_last_sync';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.alerts;

  // Estado que indica si la información mostrada proviene del almacenamiento offline
  readonly isUsingOfflineCache = signal(false);
  readonly lastSyncTimestamp = signal<string | null>(this.getStoredLastSync());

  getAlerts(search?: string): Observable<AlertItem[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any[]>(this.url(API_ENDPOINTS.alerts.list), { params }).pipe(
      map((items) => items.map((raw) => this.transformAlert(raw))),
      tap((transformed) => {
        // Guardar para soporte offline en catástrofes
        this.saveAlertsToCache(transformed);
        this.isUsingOfflineCache.set(false);
      }),
      catchError((err) => {
        console.warn('Fallo de red al obtener alertas. Intentando recuperar caché offline...', err);
        const cached = this.getAlertsFromCache();
        if (cached && cached.length > 0) {
          this.isUsingOfflineCache.set(true);
          return of(cached);
        }
        return of([]);
      })
    );
  }

  getAlert(id: string): Observable<AlertItem> {
    return this.http
      .get<any>(this.url(API_ENDPOINTS.alerts.detail(id)))
      .pipe(
        map((raw) => this.transformAlert(raw)),
        catchError(() => {
          const cached = this.getAlertsFromCache();
          const found = cached.find((a) => a.id === id);
          if (found) return of(found);
          throw new Error('Alerta no encontrada en almacenamiento offline');
        })
      );
  }

  /**
   * Dispara el scraping de avisos y alertas del COER en el backend
   */
  triggerCoerScraping(): Observable<ScrapingSyncResponse> {
    return this.http.get<ScrapingSyncResponse>(`${this.baseUrl}${API_ENDPOINTS.coerScraper.sync}`);
  }

  private saveAlertsToCache(alerts: AlertItem[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(OFFLINE_ALERTS_KEY, JSON.stringify(alerts));
        const now = new Date().toISOString();
        localStorage.setItem(LAST_SYNC_KEY, now);
        this.lastSyncTimestamp.set(now);
      }
    } catch (e) {
      console.warn('No se pudo guardar la caché de alertas offline:', e);
    }
  }

  private getAlertsFromCache(): AlertItem[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(OFFLINE_ALERTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private getStoredLastSync(): string | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(LAST_SYNC_KEY);
    } catch {
      return null;
    }
  }

  private transformAlert(raw: any): AlertItem {
    const severity = (raw.severity || '').toUpperCase();
    let kind: AlertKind = 'precaucion';
    let icon = 'notification_important';
    let label = 'Precaución';

    if (raw.kind) {
      kind = raw.kind;
    } else if (severity === 'RED') {
      kind = 'roja';
      icon = 'warning';
      label = 'Alerta Roja';
    } else if (severity === 'GREEN') {
      kind = 'informacion';
      icon = 'info';
      label = 'COER Piura';
    } else {
      kind = 'precaucion';
      icon = 'notification_important';
      label = 'Precaución COER';
    }

    let createdAtStr = raw.dateFormatted || raw.createdAt;
    if (raw.createdAt && !raw.dateFormatted) {
      try {
        const d = new Date(raw.createdAt);
        if (!isNaN(d.getTime())) {
          createdAtStr = d.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } catch {
        createdAtStr = 'Reciente';
      }
    }

    return {
      id: raw.id,
      title: raw.title || 'Alerta Oficial COER',
      description: raw.description || raw.content || '',
      kind,
      icon: raw.icon || icon,
      label: raw.label || label,
      createdAt: createdAtStr || 'Reciente',
      image: raw.image,
      actionLabel: raw.actionLabel || 'Ver en mapa',
      actionIcon: raw.actionIcon || 'map',
      latitude: raw.latitude,
      longitude: raw.longitude
    };
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
