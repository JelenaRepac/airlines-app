import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../service/country.service';
import { Country } from '../../models/country.model';
import { Airport } from '../../models/airport.model';
import { AirportService } from '../../service/airport.service';
import { validateHeaderName } from 'http';
import { FlightService } from '../../service/flight.service';
import { ScheduleDto } from '../../models/schedule-dto.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-flight-selector',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCardModule, MatDatepickerModule, MatSelectModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './flight-selector.component.html',
  styleUrls: ['./flight-selector.component.css']
})

export class FlightSelectorComponent {
  @Output() schedulesFound = new EventEmitter<ScheduleDto[]>();


  countries: Country[] = [];  // Use the Country interface to type the array
  selectedCountry: string = '';
  selectedCountryIso: string = '';
  accessKey = 'a0c2b52e19dd4518239d16ae667b4c22';
  flightForm: FormGroup;

  sourceAirports: Airport[] = [];
  destinationAirports: Airport[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private countryService: CountryService,
    private airportService: AirportService,
    private flightService: FlightService) {

    this.flightForm = this.fb.group({

      countrySource: [''],
      sourceAirport: [''],
      countryDestination: [''],
      destinationAirport: [''],
      arrivalDate: [''],
      departureDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCountries();

    this.flightForm.get('countrySource')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry?.code) {
        this.airportService.getAirportsByCountry(selectedCountry.code).subscribe(airports => {
          this.sourceAirports = airports;
        });
      }
    });

    this.flightForm.get('countryDestination')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry?.code) {
        this.airportService.getAirportsByCountry(selectedCountry.code).subscribe(airports => {
          this.destinationAirports = airports;
        });
      }
    });
  }




  onSubmit(): void {
    if (this.flightForm.valid) {
      const from = this.flightForm.value.sourceAirport?.name;
      const to = this.flightForm.value.destinationAirport?.name;
      const departureDateRaw = this.flightForm.value.departureDate;
      const arrivalDateRaw = this.flightForm.value.arrivalDate;

      // Format dates to 'YYYY-MM-DD'
      const departureDate = departureDateRaw
        ? formatDate(departureDateRaw, 'yyyy-MM-dd', 'en-US')
        : undefined;

      const arrivalDate = arrivalDateRaw
        ? formatDate(arrivalDateRaw, 'yyyy-MM-dd', 'en-US')
        : undefined;

      this.flightService.getSchedulesDinamically(from, to, departureDate, arrivalDate).subscribe({
        next: (schedules) => {
          console.log(schedules);
          if (schedules.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No search results',
              text: 'No schedules match the search criteria.',
            });

          }
          this.schedulesFound.emit(schedules);
        },
        error: (err) => {
          console.error('Error fetching schedules:', err);
        }
      });
    }
  }


  loadCountries(): void {
    this.countryService.getCountries().subscribe((response) => {
      if (!response.error) {
        this.countries = response; // čuvamo celu listu objekata
      }
    });
  }
  clearSearch(): void {
    this.flightForm.reset();

    this.flightService.getSchedulesDinamically().subscribe({
      next: (schedules) => {
        console.log(schedules);

        this.schedulesFound.emit(schedules);
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
      }
    });
  }
}
