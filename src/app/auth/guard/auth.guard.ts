import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true;
      } else {
        router.navigate(['/tenant/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/tenant/login']);
      return of(false);
    })
  );
};
