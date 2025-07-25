import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../../service/auth.service';
import { FlightSelectorComponent } from '../flight-selector/flight-selector.component';
import { FlightScheduleComponent } from "../../schedule/schedules/schedule.component";
import { ScheduleDto } from '../../models/schedule-dto.model';
import { SubscriptionCardComponent } from "../../subscribtion/subscription.component";

@Component({
  selector: 'flight-home',
  templateUrl: './flight-home.component.html',
  imports: [CommonModule, FlightSelectorComponent, FlightScheduleComponent, SubscriptionCardComponent]
})
export class FlightHomeComponent {

  title = 'AIRLINE';

  constructor(private router: Router, private auth: AuthService) { }
  isAdminUser = false;
  selectedSchedules: ScheduleDto[] = [];
  numberOfPassengers!: number;

  onSchedulesFound(schedules: ScheduleDto[]): void {
    this.selectedSchedules = schedules;
  }

  onPassengersChanged(numberOfPassengers: number): void {
    this.numberOfPassengers = numberOfPassengers;
  }



}

