import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { SubscriptionService } from '../../admin/services/subscription.service';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService);
  const subscriptionService = inject(SubscriptionService)

    // Obtenemos el user autenticado y el tenant
    authService.me().subscribe((me) => {
      if (me.user) {
        subscriptionService.getSubscriptionById(me.user.tenant.id).subscribe((subs) => {
          console.log('desde guardian' , subs);
          
          if (subs.status == 1) {
            console.log(subs.status);
            return true
          }
          router.navigate(['/admin/plan']);
          return false
        })
      }
    });
    
    return true

};
