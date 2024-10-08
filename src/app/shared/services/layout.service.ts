import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isAdminView = false;
  isPromoView = false;
  isPublicBusinessView = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const adminRoutes = [
          '/admin/dashboard',
          '/admin/catalog',
          '/admin/sliders',
          '/admin/orders',
          '/admin/business-settings',
          '/admin/product-management',
          '/admin/schedules',
          '/admin/plan'
        ];
        const promoRoutes = ['/promotion'];

        // Rutas actualizadas con el prefijo 'store'
        const publicBusinessRoutes = [
          /^\/store\/[^\/]+$/, // Para rutas como '/store/:businessName'
          /^\/store\/product-explorer\/[^\/]+$/ // Para rutas como '/store/product-explorer/:businessName'
        ];

        this.isAdminView = adminRoutes.some((route) =>
          this.router.url.startsWith(route)
        );
        this.isPromoView = promoRoutes.some((route) =>
          this.router.url.startsWith(route)
        );

        this.isPublicBusinessView = publicBusinessRoutes.some((regex) =>
          regex.test(this.router.url)
        );
      });
  }
}
