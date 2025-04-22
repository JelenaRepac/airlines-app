import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleDto } from '../../models/schedule.dto';
import { FlightScheduleComponent } from "../schedules/schedule.component";
import { FlightService } from '../../service/flight.service';
import { FlightInformationDto } from '../../models/flight.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'manage-flight-schedule',
  templateUrl: './manage-schedule.component.html',
  styleUrls: ['./manage-schedule.component.css'],
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    FlightScheduleComponent
  ]
})
export class ScheduleManageComponent implements OnInit {
  schedules: ScheduleDto[] = [];
  flights: FlightInformationDto[] = [];
  showAddScheduleModal = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSchedules();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      flight:            [''],  
    departureDate:     [''],
    departureTime:     [''],
    arrivalDate:       [''],
    arrivalTime:       [''],
    sourceAirport:     [''],
    destinationAirport:[''],
    status:            [''],
    flightInformation: ['']
    });
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: data => this.schedules = data,
      error: err => console.error('Failed to load schedules', err)
    });
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: data => {
        this.flights = data;
        console.log('Flights loaded:', data);
      },
      error: err => console.error('Failed to load flights', err)
    });
  }

  openAddScheduleModal(): void {
    this.loadFlights();
    this.showAddScheduleModal = true;
  }

  closeAddScheduleModal(): void {
    this.showAddScheduleModal = false;
  }

  onSubmit(): void {
 
    const raw = this.form.value; 
    const payload: ScheduleDto = {
      status:           raw.status,
      departureDate:    raw.departureDate,
      departureTime:    raw.departureTime,
      arrivalDate:      raw.arrivalDate,
      arrivalTime:      raw.arrivalTime,
      startAirport:     raw.sourceAirport,
      endAirport:       raw.destinationAirport,
      flightInformation:raw.flightInformation 
    };
  
    this.scheduleService.addSchedule(payload).subscribe({
      next: saved => {
        this.schedules.push(saved);
        this.closeAddScheduleModal();
      },
      error: err => console.error('Add schedule failed', err)
    });
  }
}
