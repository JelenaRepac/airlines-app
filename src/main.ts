import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
//import { HttpClientModule } from '@angular/common/http';  
import { provideHttpClient } from '@angular/common/http';  // Add this import

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
