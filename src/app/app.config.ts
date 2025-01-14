import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core'; // Provide Native Date Adapter

export const appConfig = {
  providers: [
    provideHttpClient(), // HTTP Client provider
    importProvidersFrom(FormsModule), // FormsModule for template-driven forms
    importProvidersFrom(MatNativeDateModule), // Angular Material Native Date Module
    provideNativeDateAdapter(), // Provide the native date adapter
  ],
};
