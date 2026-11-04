import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import {
  BlockedRoad,
  FloodZone,
  IncidentMarker,
  IncidentRequest,
  MapData,
  Shelter
} from '../models/mapa.model';

@Injectable({ providedIn: 'root' })
export class MapaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.maps;

  getMapData(): Observable<MapData> {
    return forkJoin({
      shelters: this.http.get<Shelter[]>(this.url(API_ENDPOINTS.map.shelters)),
      blockedRoads: this.http.get<BlockedRoad[]>(this.url(API_ENDPOINTS.map.blockedRoads)),
      floodZones: this.http.get<FloodZone[]>(this.url(API_ENDPOINTS.map.floodZones))
    });
  }

  reportIncident(incident: IncidentRequest): Observable<void> {
    return this.http.post<void>(this.url(API_ENDPOINTS.map.incidents), incident);
  }

  getAdminIncidents(status = 'ACTIVE'): Observable<IncidentMarker[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<IncidentMarker[]>(this.url(API_ENDPOINTS.incidents.admin), { params });
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
