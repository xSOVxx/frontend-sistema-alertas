import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { GoalItem, StockItem, VolunteerRequest, VolunteerResponse } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AyudaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.aid;

  registerVolunteer(request: VolunteerRequest): Observable<VolunteerResponse> {
    return this.http.post<VolunteerResponse>(this.url(API_ENDPOINTS.volunteers.register), request);
  }

  getStock(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(this.url(API_ENDPOINTS.resources.stock));
  }

  getGoals(): Observable<GoalItem[]> {
    return this.http.get<GoalItem[]>(this.url(API_ENDPOINTS.resources.goals));
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
