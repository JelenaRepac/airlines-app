import { Routes } from '@angular/router';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { ConfirmUserComponent } from './confirm-user/confirm-user.component';
import { AuthGuard } from './auth-guard/auth-guard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { FlightHomeComponent } from './flight-home/flight-home.component';

export const routes: Routes = [
  // Default route redirects to login if not authenticated
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Routes
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'confirm', component: ConfirmUserComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'book-flight', component: FlightHomeComponent , canActivate: [AuthGuard]},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },

  // Fallback for undefined routes
  { path: '**', redirectTo: '/login' }
];
