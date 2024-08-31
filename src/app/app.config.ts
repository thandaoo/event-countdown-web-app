import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'

import { MAT_DATE_LOCALE } from '@angular/material/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-CA' },
  ],
}
