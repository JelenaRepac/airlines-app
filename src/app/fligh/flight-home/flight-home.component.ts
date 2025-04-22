import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../../service/auth.service';
import { FlightSelectorComponent } from '../flight-selector/flight-selector.component';
import { FlightScheduleComponent } from "../../schedule/schedules/schedule.component";

@Component({
  selector: 'flight-home',
  templateUrl: './flight-home.component.html',
  imports: [NavbarComponent, CommonModule, FlightSelectorComponent, FlightScheduleComponent]
})
export class FlightHomeComponent {
  title = 'AIRLINE';

  constructor(private router: Router, private auth: AuthService) { }
  isAdminUser = false;



}

