import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly baseUrl = environment.services.auth;
  private readonly mockUsers = [
    {
      email: 'usuario@correo.com',
      password: 'contraseña',
      response: {
        accessToken: 'mock-token-demo-user-1',
        refreshToken: undefined,
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
        tap((response) =>
          this.session.setSession(response.accessToken, response.user, response.refreshToken)
        )
      );
    }
    return this.http.post<AuthResponse>(this.url(API_ENDPOINTS.auth.login), credentials).pipe(
      tap((response) =>
        this.session.setSession(response.accessToken, response.user, response.refreshToken)
      )
    );
  }

  register(request: RegisterRequest): Observable<{ message: string; user: { id: string } }> {
    return this.http.post<{ message: string; user: { id: string } }>(
      this.url(API_ENDPOINTS.auth.register),
      request
    );
  }

  refresh(): Observable<Partial<AuthResponse>> {
    const refreshToken = this.session.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token'));
    }
    return this.http
      .post<Partial<AuthResponse>>(this.url(API_ENDPOINTS.auth.refresh), { refreshToken })
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.session.updateTokens(response.accessToken, response.refreshToken);
          }
        })
      );
  }

  logout(): Observable<void> {
    const refreshToken = this.session.refreshToken;
    const clear = () => this.session.clear();

    if (!refreshToken) {
      clear();
      return of(void 0);
    }

    return this.http
      .post<void>(this.url(API_ENDPOINTS.auth.logout), { refreshToken })
      .pipe(
        catchError(() => of(void 0)),
        tap(clear)
      );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(this.url(API_ENDPOINTS.auth.forgotPassword), { email });
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
