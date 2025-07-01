import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleInput } from '../../models/schedule-input.model';
import { FlightScheduleComponent } from "../schedules/schedule.component";
import { FlightService } from '../../service/flight.service';
import { FlightInformationDto } from '../../models/flight.model';
import Swal from 'sweetalert2';
import { Country } from '../../models/country.model';
import { CountryService } from '../../service/country.service';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AirportService } from '../../service/airport.service';
import { Airport } from '../../models/airport.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { ScheduleDto } from '../../models/schedule-dto.model';

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
    FlightScheduleComponent,
    MatInputModule,
    MatNativeDateModule,
    MatSelect,
    MatOption,
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect,
    FormsModule,
    MatOption

  ]
})
export class ScheduleManageComponent implements OnInit {


  schedules: ScheduleInput[] = [];

  flights: FlightInformationDto[] = [];
  showAddScheduleModal = false;
  countries: Country[] = [];
  selectedCountry: string | null = null;
  sourceAirports: Airport[] = [];
  destinationAirports: Airport[] = [];

  newlyAddedSchedule: ScheduleInput | null = null;


  form!: FormGroup;
  departureDate: Date | null = null;
  arrivalDate: Date | null = null;
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private flightService: FlightService,
    private countryService: CountryService,
    private airportService: AirportService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSchedules();
    this.loadCountries();

    this.form.get('countrySource')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry?.code) {
        this.airportService.getAirportsByCountry(selectedCountry.code).subscribe(airports => {
          this.sourceAirports = airports;
        });
      }
    });

    this.form.get('countryDestination')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry?.code) {
        this.airportService.getAirportsByCountry(selectedCountry.code).subscribe(airports => {
          this.destinationAirports = airports;
        });
      }
    });

  }


  loadCountries(): void {
    this.countryService.getCountries().subscribe((response) => {
      if (!response.error) {
        this.countries = response;
      }
    })
  }


  initializeForm(): void {
    this.form = this.fb.group({
      flight: [''],
      departureDate: [''],
      departureTime: [''],
      arrivalDate: [''],
      arrivalTime: [''],
      sourceAirport: [null],
      destinationAirport: [null],
      status: [''],
      flightInformation: [''],
      countryDestination: [''],
      countrySource: ['']
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
    const payload: ScheduleInput = {
      status: raw.status,
      departureDate: raw.departureDate,
      departureTime: raw.departureTime,
      arrivalDate: raw.arrivalDate,
      arrivalTime: raw.arrivalTime,
      startAirport: raw.sourceAirport?.name ?? '',    // <-- take only name
      endAirport: raw.destinationAirport?.name ?? '', // <-- take only name
      flightInformation: raw.flightInformation


    };

    console.log(payload);

    this.scheduleService.addSchedule(payload).subscribe({
      next: (saved: ScheduleInput) => {
        this.newlyAddedSchedule = saved;

        this.closeAddScheduleModal();
        Swal.fire({
          icon: 'success',
          title: 'Successfully inserted new schedule for flight!',
        });
      },
      error: (err: any) => {
        console.error('Add schedule failed', err);
      }
    });

  }
}