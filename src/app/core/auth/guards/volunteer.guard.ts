import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const volunteerGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.accessToken) {
    return router.createUrlTree(['/login']);
  }

  if (!session.isVolunteer() && !session.isAdmin()) {
    return router.createUrlTree(['/perfil']);
  }

  return true;
};
