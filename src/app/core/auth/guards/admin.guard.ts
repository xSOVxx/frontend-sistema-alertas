import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const adminGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.accessToken) {
    return router.createUrlTree(['/login']);
  }

  if (!session.isAdmin()) {
    return router.createUrlTree(['/perfil']);
  }

  return true;
};
