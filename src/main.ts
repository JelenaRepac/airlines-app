import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';  
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
     provideNativeDateAdapter(),
     provideAnimations()
  ],
}).catch(err => console.error(err));
