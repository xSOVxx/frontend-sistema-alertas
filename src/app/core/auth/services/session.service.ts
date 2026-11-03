import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'pontealerta_access_token';
const REFRESH_TOKEN_KEY = 'pontealerta_refresh_token';
const USER_KEY = 'pontealerta_user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly user = signal<UserProfile | null>(this.readUser());

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setSession(accessToken: string, user: UserProfile, refreshToken?: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  updateTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  updateUser(user: UserProfile): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  hasRole(role: string): boolean {
    const payload = this.tokenPayload();
    return payload?.realm_access?.roles?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isVolunteer(): boolean {
    return this.hasRole('VOLUNTEER');
  }

  private tokenPayload(): { realm_access?: { roles?: string[] } } | null {
    const token = this.accessToken;
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      return JSON.parse(decodeURIComponent(escape(atob(padded))));
    } catch {
      return null;
    }
  }

  private readUser(): UserProfile | null {
    const value = localStorage.getItem(USER_KEY);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as UserProfile;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
