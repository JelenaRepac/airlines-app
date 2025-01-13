// app.routes.ts
import { Routes } from '@angular/router';
import { SignUpComponent } from "../sign-up/sign-up.component";
import { LoginComponent } from "../login/login.component";
import { HomeComponent } from '../home/home.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
];
