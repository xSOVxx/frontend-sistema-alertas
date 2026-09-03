import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { BlockedRoad, FloodZone, IncidentRequest, Shelter } from '../../models/api.models';

export interface MapData {
  shelters: Shelter[];
  blockedRoads: BlockedRoad[];
  floodZones: FloodZone[];
}

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

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
