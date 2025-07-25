import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  imports:[MatSnackBarModule, MatInputModule, FormsModule, ReactiveFormsModule, MatStepperModule
  ]
})
export class AppModule {}
