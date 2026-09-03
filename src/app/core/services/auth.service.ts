import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { AuthResponse, LoginRequest } from '../../models/api.models';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly mockUsers = [
    {
      email: 'usuario@correo.com',
      password: 'contraseña',
      response: {
        accessToken: 'mock-access-token',
        user: {
          id: 'demo-user-1',
          name: 'Usuario Demo',
          email: 'usuario@correo.com',
          phone: '+51 900 000 000',
          location: 'Piura, Perú',
          joinDate: '2026-09-03'
        }
      }
    }
  ];

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (environment.useMockAuth) {
      const account = this.mockUsers.find(
        (user) => user.email === credentials.email && user.password === credentials.password
      );
      if (!account) {
        return throwError(() => new Error('Credenciales inválidas'));
      }
      return of(account.response).pipe(
        tap((response) => this.session.setSession(response.accessToken, response.user))
      );
    }
    return this.http.post<AuthResponse>(this.url(API_ENDPOINTS.auth.login), credentials).pipe(
      tap((response) => this.session.setSession(response.accessToken, response.user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.url(API_ENDPOINTS.auth.logout), {}).pipe(
      tap(() => this.session.clear())
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(this.url(API_ENDPOINTS.auth.forgotPassword), { email });
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
