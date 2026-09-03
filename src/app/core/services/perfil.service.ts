import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { UserProfile } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

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
