import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { UserProfile } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.users;

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.url(API_ENDPOINTS.profile.me));
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(this.url(API_ENDPOINTS.profile.me), profile);
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
