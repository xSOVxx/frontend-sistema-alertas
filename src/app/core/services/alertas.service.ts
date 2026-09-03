import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { AlertItem } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getAlerts(search?: string): Observable<AlertItem[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<AlertItem[]>(this.url(API_ENDPOINTS.alerts.list), { params });
  }

  getAlert(id: string): Observable<AlertItem> {
    return this.http.get<AlertItem>(this.url(API_ENDPOINTS.alerts.detail(id)));
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
