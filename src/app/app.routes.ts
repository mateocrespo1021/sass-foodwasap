import { Routes } from '@angular/router';
import { authGuard } from './auth/guard/auth.guard';
import { loginGuard } from './auth/guard/login.guard';

export const routes: Routes = [
  {
    path: 'promotion',
    loadComponent: () =>
      import('./promotion/pages/home-promo/home-promo.component').then((c) => c.HomePromoComponent),
  },
  {
    path: 'store/:businessName',
    loadComponent: () =>
      import('./food/pages/home/home.component').then((c) => c.HomeComponent),
  },
 
  {
    path: 'store/product-explorer/:businessName',
    loadComponent: () =>
      import('./food/pages/product-explorer/product-explorer.component').then(
        (c) => c.ProductExplorerComponent
      ),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin/pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/catalog',
    loadComponent: () =>
      import('./admin/pages/catalog/catalog.component').then(
        (c) => c.CatalogComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/sliders',
    loadComponent: () =>
      import('./admin/pages/sliders-management/sliders-management.component').then(
        (c) => c.SlidersManagementComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./admin/pages/orders/orders.component').then(
        (c) => c.OrdersComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/business-settings',
    loadComponent: () =>
      import('./admin/pages/business-settings/business-settings.component').then(
        (c) => c.BusinessSettingsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/product-management/:id',
    loadComponent: () =>
      import(
        './admin/pages/product-management/product-management.component'
      ).then((c) => c.ProductManagementComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tenant/login',
    loadComponent: () =>
      import('./auth/pages/login-tenant/login-tenant.component').then(
        (c) => c.LoginTenantComponent
      ),
    canActivate: [loginGuard],
  },
  {
    path: 'tenant/register',
    loadComponent: () =>
      import('./auth/pages/register-tenant/register-tenant.component').then((c) => c.RegisterTenantComponent),
  },
  {
    path:"plan-tenant",
    loadComponent: () =>
      import('./tenant/pages/select-plan-tenant/select-plan-tenant.component').then((c) => c.SelectPlanTenantComponent),
},
{
    path:"info-tenant",
    loadComponent: () =>
      import('./tenant/pages/info-tenant/info-tenant.component').then((c) => c.InfoTenantComponent),
}
];
