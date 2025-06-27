import { ScheduleService } from '../../service/schedule.service';
import { ScheduleDto } from '../../models/schedule.dto';
import { Component, OnInit } from '@angular/core';
import { SharedModules } from '../../shared.module';
import {  Router } from '@angular/router';


@Component({
  selector: 'flight-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports:[SharedModules]
})
export class FlightScheduleComponent implements OnInit {
  flightSchedules: ScheduleDto[] = [];
  panelOpen = false;
  isAdmin: boolean = false; 

  constructor(private scheduleService: ScheduleService, private router: Router,
    private flightSelectionService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (data) => this.flightSchedules = data,
      error: (err) => console.error('Failed to load schedules', err)
    });
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
onButtonClick(flightScheduleId: number | undefined): void {
    this.flightSelectionService.setSelectedFlightId(flightScheduleId);
  this.router.navigate(['airline/book-seats']); // Pass ID as route param
}


}
