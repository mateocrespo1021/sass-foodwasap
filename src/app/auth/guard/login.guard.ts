import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLocalStorageAvailable = typeof localStorage !== 'undefined';

  if (!isLocalStorageAvailable) return true

   const admin = authService.checkAuthentication().subscribe((result)=>{
    if (result) {
      if (localStorage.getItem('token') && localStorage.getItem('user')) {
        router.navigateByUrl('/admin/dashboard');
        return false
      }
    }
    return true
   })
  
  return true;
};
