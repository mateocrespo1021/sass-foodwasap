import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  HttpClient,
  HttpHandler,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideOAuthClient } from 'angular-oauth2-oidc';
// , withHashLocation()
// provideOAuthClient(),
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    
    provideToastr({
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    ConfirmationService,
    MessageService,
  ],
};
