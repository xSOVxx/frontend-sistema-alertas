import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';

export interface PendingHelpRequest {
  id: string;
  payload: any;
  timestamp: string;
}

const OFFLINE_SOS_KEY = 'pontealerta_offline_sos_queue';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private readonly http = inject(HttpClient, { optional: true });

  readonly isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly wasOffline = signal(false);
  readonly justReconnected = signal(false);

  readonly reconnected$ = new Subject<void>();

  readonly pendingRequests = signal<PendingHelpRequest[]>(this.loadPendingRequests());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  private handleOnline(): void {
    const previouslyOffline = !this.isOnline() || this.wasOffline();
    this.isOnline.set(true);

    if (previouslyOffline) {
      this.wasOffline.set(false);
      this.justReconnected.set(true);
      this.reconnected$.next();
      this.syncPendingHelpRequests();

      setTimeout(() => {
        this.justReconnected.set(false);
      }, 4500);
    }
  }

  private handleOffline(): void {
    this.isOnline.set(false);
    this.wasOffline.set(true);
    this.justReconnected.set(false);
  }

  queueOfflineHelpRequest(payload: any): string {
    const offlineTicket = 'OFFLINE-SOS-' + Math.floor(Math.random() * 90000 + 10000);
    const item: PendingHelpRequest = {
      id: offlineTicket,
      payload,
      timestamp: new Date().toISOString()
    };

    const current = this.loadPendingRequests();
    current.push(item);
    this.savePendingRequests(current);
    this.pendingRequests.set(current);
    return offlineTicket;
  }

  syncPendingHelpRequests(): void {
    const client = this.http;
    if (!client) return;
    const current = this.loadPendingRequests();
    if (current.length === 0) return;

    const endpoint = `${environment.apiBaseUrl}${API_ENDPOINTS.map.incidents}`;

    current.forEach((req) => {
      client.post(endpoint, req.payload).subscribe({
        next: () => {
          this.removePendingRequest(req.id);
        },
        error: (err) => {
          console.warn('Reintento de sincronizacion SOS fallo temporalmente:', err);
        }
      });
    });
  }

  private removePendingRequest(id: string): void {
    const updated = this.loadPendingRequests().filter((r) => r.id !== id);
    this.savePendingRequests(updated);
    this.pendingRequests.set(updated);
  }

  private loadPendingRequests(): PendingHelpRequest[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(OFFLINE_SOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private savePendingRequests(list: PendingHelpRequest[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(OFFLINE_SOS_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.error('Error al guardar cola offline SOS', e);
    }
  }
}
