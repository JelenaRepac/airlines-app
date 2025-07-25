import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
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
import { MatAutocomplete, MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-flight-selector',
  imports: [MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatAutocomplete,
    MatAutocompleteModule],
  templateUrl: './flight-selector.component.html',
  styleUrls: ['./flight-selector.component.css']
})

export class FlightSelectorComponent {
  @Output() schedulesFound = new EventEmitter<ScheduleDto[]>();
  @Output() numberOfPassengersChanged = new EventEmitter<number>();

  countries: Country[] = [];  // Use the Country interface to type the array
  selectedCountry: string = '';
  selectedCountryIso: string = '';
  accessKey = 'a0c2b52e19dd4518239d16ae667b4c22';
  flightForm: FormGroup;

  sourceAirports: Airport[] = [];
  destinationAirports: Airport[] = [];


  countryControl = new FormControl<Country | string | null>(null);
  filteredSourceCountries!: Observable<Country[]>;
  filteredDestinationCountries!: Observable<Country[]>;

  passengerCounts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 166];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private countryService: CountryService,
    private airportService: AirportService,
    private flightService: FlightService) {

    this.flightForm = this.fb.group({

      countrySource: [null],
      sourceAirport: [null],
      countryDestination: [null],
      destinationAirport: [null],
      departureDate: [null],
      arrivalDate: [null],
      numberOfPassengers: [1] // default to 1
    });
    let maxAvailableSeats = 180;

    this.passengerCounts = Array.from({ length: maxAvailableSeats }, (_, i) => i + 1);


  }

  ngOnInit(): void {
    this.loadCountries();


    this.filteredSourceCountries = this.flightForm.get('countrySource')!.valueChanges.pipe(
      startWith(null),
      map(value => typeof value === 'string' ? value : value?.name ?? ''),
      map(name => name ? this._filterCountries(name) : this.countries.slice())
    );

    this.filteredDestinationCountries = this.flightForm.get('countryDestination')!.valueChanges.pipe(
      startWith(null),
      map(value => typeof value === 'string' ? value : value?.name ?? ''),
      map(name => name ? this._filterCountries(name) : this.countries.slice())
    );



    this.flightForm.get('countrySource')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry?.code) {
        console.log('USAOOOO')
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
  private _filterCountries(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  displayCountry(country: Country | null): string {
    return country ? country.name : '';
  }



  onSubmit(): void {
    if (this.flightForm.valid) {
        const passengers = this.flightForm.get('numberOfPassengers')?.value ?? 1;  // default to 1 if undefined or null

      console.log('BROJ PUTNIKA'+this.flightForm.get('numberOfPassengers'))
      this.numberOfPassengersChanged.emit(passengers);


      const from = this.flightForm.value.sourceAirport?.name;
      const to = this.flightForm.value.destinationAirport?.name;
      const departureDateRaw = this.flightForm.value.departureDate;
      const arrivalDateRaw = this.flightForm.value.arrivalDate;
      const numberOfPassengers = this.flightForm.value.numberOfPassengers;
      // Format dates to 'YYYY-MM-DD'
      const departureDate = departureDateRaw
        ? formatDate(departureDateRaw, 'yyyy-MM-dd', 'en-US')
        : undefined;

      const arrivalDate = arrivalDateRaw
        ? formatDate(arrivalDateRaw, 'yyyy-MM-dd', 'en-US')
        : undefined;
      console.log(numberOfPassengers);
      this.flightService.getSchedulesDinamically(from, to, departureDate, arrivalDate, numberOfPassengers).subscribe({
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
