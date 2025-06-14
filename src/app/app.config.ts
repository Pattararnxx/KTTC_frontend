import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';

export function tokenGetter() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("access_token");
  }
  return null;

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:3000"],
          disallowedRoutes: ["http://localhost:3000/auth/login"],
        },
      }),
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    )
  ]
};
