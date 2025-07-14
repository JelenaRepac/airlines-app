import { Routes } from '@angular/router';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard/auth-guard.component';
import { ProfileComponent } from './profile/user/profile.component';
import { UsersComponent } from './adm/admins/admins.component';
import { FlightHomeComponent } from './fligh/flight-home/flight-home.component';
import { FlightManageComponent } from './fligh/manage-flight/flight-manage.component';
import { ScheduleManageComponent } from './schedule/manage-schedule/manage-schedule.component';
import { AirplaneSeatsComponent } from './airplane-seats/airplane-seats.component';
import { BookFlightComponent } from './book-flight/book-flight.component';

export const routes: Routes = [
  // Default route redirects to login
  { path: '', redirectTo: 'airline/login', pathMatch: 'full' },

  // Public routes
  { path: 'airline/login', component: LoginComponent },
  { path: 'airline/sign-up', component: SignUpComponent },

  // Protected routess
  { path: 'airline/home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'airline/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'airline/book-flight', component: FlightHomeComponent, canActivate: [AuthGuard] },
  { path: 'airline/users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'airline/manage-flight', component: FlightManageComponent, canActivate: [AuthGuard] },
  { path: 'airline/manage-flight-schedule', component: ScheduleManageComponent, canActivate: [AuthGuard] },
  {path: 'airline/book-seats', component:AirplaneSeatsComponent, canActivate:[AuthGuard]},
  {path:'airline/app-book-flight/:id', component:BookFlightComponent, canActivate:[AuthGuard]},

  // Fallback
  { path: '**', redirectTo: 'airline/login' }
];
