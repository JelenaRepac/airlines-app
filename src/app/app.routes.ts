import { Routes } from '@angular/router';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { ConfirmUserComponent } from './confirm-user/confirm-user.component';
import { AuthGuard } from './auth-guard/auth-guard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './adm/admins/admins.component';
import { FlightHomeComponent } from './fligh/flight-home/flight-home.component';
import { FlightManageComponent } from './fligh/manage-flight/flight-manage.component';
import {  ScheduleManageComponent } from './schedule/manage-schedule/manage-schedule.component';


export const routes: Routes = [
  // Default route redirects to login if not authenticated
  { path: '', redirectTo: '/airline/login', pathMatch: 'full' },

  // Routes
  { path: '/airline/login', component: LoginComponent },
  { path: '/airline/sign-up', component: SignUpComponent },
  { path: '/airline/confirm', component: ConfirmUserComponent },
  { path: '/airline/home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '/airline/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '/airline/book-flight', component: FlightHomeComponent, canActivate: [AuthGuard] },
  { path: '/airline/users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: '/airline/manage-flight', component: FlightManageComponent,canActivate: [AuthGuard]  },
  { path: '/airline/manage-flight-schedule', component: ScheduleManageComponent,canActivate: [AuthGuard]  },

  // Fallback for undefined routes
  { path: '**', redirectTo: '/airline/login' }
];
