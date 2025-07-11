import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table'; // Import the MatTableModule
import { MatButtonModule } from '@angular/material/button'; // If you use buttons
import { MatPaginatorModule } from '@angular/material/paginator'; // If you need pagination
import { MatSortModule } from '@angular/material/sort'; // If you need sorting
import { MatTabsModule } from '@angular/material/tabs'
import { AuthService } from '../../service/auth.service';
import { AviationService } from '../../service/aviation.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  FlightService } from '../../service/flight.service';
import { MatIconModule } from '@angular/material/icon';
import { FlightInformationDto } from '../manage-flight/flight-manage.component';
import Swal from 'sweetalert2';

export interface Flight {
  flightNumber: string;
  departureDate: Date;
  destination: string;
  status: string;
}

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule, // Make sure MatTableModule is imported
    MatButtonModule, // If you use buttons
   
    MatIconModule
  ],
})
export class FlightsComponent {
 @Input() flights: FlightInformationDto[] = [];

  displayedColumns: string[] = ['fromCity', 'toCity', 'departureTime', 'price']; // List of columns to display

  panelOpen = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    // Fetch flights when the component is initialized
    this.loadFlights();
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
      },
      error: (err) => {
        console.error('Failed to load flights', err);
      },
    });
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
  
  deleteFlight(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.flightService.deleteFlight(id).subscribe({
          next: () => {
            // remove from local array
            this.flights = this.flights.filter(f => f.id !== id);
            Swal.fire('Deleted!', 'Flight has been removed.', 'success');
          },
          error: err => {
            console.error(err);
            Swal.fire('Error', 'Could not delete flight.', 'error');
          }
        });
      }
    });
  }

  // countries: any[] = [];
  // filteredCountries: any[] = [];

  // cities: any[] = [];
  // filteredCities: any[] = [];

  // countryFilter = '';
  // cityFilter = '';

  // selectedCountry: string = '';
  // selectedCity: string = '';
  // airports: any[] = [];

// ngOnInit(): void {
//     this.aviationService.getCountries().subscribe(data => {
//       this.countries = data?.data || [];
//       console.log(this.countries);
//     });
//   }
  

  // onCountrySelected(): void {
  //   if (this.selectedCountry) {
  //     this.aviationService.getCities(this.selectedCountry).subscribe(data => {
  //       this.cities = data?.data || [];
  //       this.filteredCities = [...this.cities];
  //       this.cityFilter = '';
  //     });
  //   }
  // }

  // onCitySelected(): void {
  //   if (this.selectedCity) {
  //     this.aviationService.getAirports(this.selectedCity).subscribe(data => {
  //       this.airports = data?.data || [];
  //     });
  //   }
  // }

  // filterCountries(): void {
  //   const term = this.countryFilter.toLowerCase();
  //   this.filteredCountries = this.countries.filter(c =>
  //     c.country_name.toLowerCase().includes(term)
  //   );
  // }
  
  // filterCities(): void {
  //   const term = this.cityFilter.toLowerCase();
  //   this.filteredCities = this.cities.filter(c =>
  //     c.city_name.toLowerCase().includes(term)
  //   );
  // }
}