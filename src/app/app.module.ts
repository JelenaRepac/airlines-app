import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app/app.component';
import {HttpClientModule} from '@angular/common/http';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: AppComponent },
  { path: 'sign-up', component: SignUpComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule, 
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes)
  ],
  providers: [  
    MatDatepickerModule,
    MatNativeDateModule  
  ],
  exports: [RouterModule]
})
export class AppModule  { }
