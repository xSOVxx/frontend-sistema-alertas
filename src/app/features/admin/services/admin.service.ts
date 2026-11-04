import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import {
  FloodZone,
  Incident,
  InventoryItem,
  MetricsSummary,
  RoadBlockade,
  Shelter,
  Volunteer,
  VolunteerStatus
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.users;

  getMetrics(): Observable<MetricsSummary> {
    return this.http.get<MetricsSummary>(this.url(API_ENDPOINTS.metrics.summary));
  }

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.url(API_ENDPOINTS.inventory.list));
  }

  createInventory(payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.url(API_ENDPOINTS.inventory.create), payload);
  }

  updateInventory(id: string, payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(this.url(API_ENDPOINTS.inventory.detail(id)), payload);
  }

  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(this.url(API_ENDPOINTS.inventory.detail(id)));
  }

  getShelters(): Observable<Shelter[]> {
    return this.http.get<Shelter[]>(this.url(API_ENDPOINTS.map.shelters));
  }

  createShelter(payload: Partial<Shelter>): Observable<Shelter> {
    return this.http.post<Shelter>(this.url(API_ENDPOINTS.map.shelters), payload);
  }

  updateShelter(id: string, payload: Partial<Shelter>): Observable<Shelter> {
    return this.http.patch<Shelter>(this.url(API_ENDPOINTS.map.shelter(id)), payload);
  }

  deleteShelter(id: string): Observable<void> {
    return this.http.delete<void>(this.url(API_ENDPOINTS.map.shelter(id)));
  }

  getFloodZones(): Observable<FloodZone[]> {
    return this.http.get<FloodZone[]>(this.url(API_ENDPOINTS.map.floodZones));
  }

  createFloodZone(payload: Partial<FloodZone>): Observable<FloodZone> {
    return this.http.post<FloodZone>(this.url(API_ENDPOINTS.map.floodZones), payload);
  }

  updateFloodZone(id: string, payload: Partial<FloodZone>): Observable<FloodZone> {
    return this.http.patch<FloodZone>(this.url(API_ENDPOINTS.map.floodZone(id)), payload);
  }

  deleteFloodZone(id: string): Observable<void> {
    return this.http.delete<void>(this.url(API_ENDPOINTS.map.floodZone(id)));
  }

  getAllRoads(): Observable<RoadBlockade[]> {
    return this.http.get<RoadBlockade[]>(this.url(API_ENDPOINTS.map.allBlockedRoads));
  }

  createRoad(payload: Partial<RoadBlockade>): Observable<RoadBlockade> {
    return this.http.post<RoadBlockade>(this.url(API_ENDPOINTS.map.blockedRoads), payload);
  }

  updateRoad(id: string, payload: Partial<RoadBlockade>): Observable<RoadBlockade> {
    return this.http.patch<RoadBlockade>(this.url(API_ENDPOINTS.map.blockedRoad(id)), payload);
  }

  deleteRoad(id: string): Observable<void> {
    return this.http.delete<void>(this.url(API_ENDPOINTS.map.blockedRoad(id)));
  }

  getVolunteers(): Observable<Volunteer[]> {
    return this.http.get<Volunteer[]>(this.url(API_ENDPOINTS.volunteers.list));
  }

  updateVolunteerStatus(id: string, status: VolunteerStatus): Observable<Volunteer> {
    return this.http.patch<Volunteer>(this.url(API_ENDPOINTS.volunteers.status(id)), {
      status
    });
  }

  getIncidents(status?: string): Observable<Incident[]> {
    const query = status ? `?status=${status}` : '';
    return this.http.get<Incident[]>(this.url(`${API_ENDPOINTS.incidents.admin}${query}`));
  }

  updateIncidentStatus(id: string, status: 'ACTIVE' | 'RESOLVED'): Observable<Incident> {
    return this.http.patch<Incident>(this.url(API_ENDPOINTS.incidents.update(id)), {
      status
    });
  }

  deleteIncident(id: string): Observable<void> {
    return this.http.delete<void>(this.url(API_ENDPOINTS.incidents.remove(id)));
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
