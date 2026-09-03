import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../../models/api.models';

const ACCESS_TOKEN_KEY = 'pontealerta_access_token';
const USER_KEY = 'pontealerta_user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly user = signal<UserProfile | null>(this.readUser());

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setSession(accessToken: string, user: UserProfile): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
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
