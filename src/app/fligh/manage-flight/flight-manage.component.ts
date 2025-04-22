import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FlightService } from '../../service/flight.service';
import Swal from 'sweetalert2';
import { FlightsComponent } from "../flights/flights.component";
import { MatCardModule } from '@angular/material/card';
export interface FlightInformationDto {
  id?: number;
  flightName: string;
  capacity: number;
  flightType: string;
  seatType: string;
  maximumWeightForPassenger: number;
  airlineService: string;
}

@Component({
  selector: 'manage-flight',
  templateUrl: './flight-manage.component.html',
  styleUrls: ['./flight-manage.component.css'],
    imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    FlightsComponent,
    MatCardModule
]
})



export class FlightManageComponent {
  flight: FlightInformationDto = {
    flightName: '',
    capacity: 0,
    flightType: '',
    seatType: '',
    maximumWeightForPassenger: 0,
    airlineService: ''
  };
  
    flights: FlightInformationDto[] = [];
    panelOpen = false;
    showAddFlightModal = false;
flightTypes = ['International', 'Domestic'];
seatTypes = ['Economic', 'Business'];

  submittedFlight?: FlightInformationDto;

  constructor(private flightService: FlightService) {}

  submitFlight(): void {

      if (!this.flight.flightName.trim() ||
          this.flight.capacity <= 0 ||
          !this.flight.flightType.trim() ||
          !this.flight.seatType.trim() ||
          this.flight.maximumWeightForPassenger <= 0 ||
          !this.flight.airlineService.trim()) {
            this.flights.push(this.flight); // After submitting, add to the list


        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all flight information before submitting.'
        });
        return;
      }

    this.flightService.addFlight(this.flight).subscribe({
      next: (data) => {
        this.submittedFlight = data;
  
        this.flights.push({ ...this.submittedFlight }); // Add the flight data to the list (for example)
        this.closeAddFlightModal();
        Swal.fire({
          icon: 'success',
          text: 'Successfully inserted new flight!'
        });
       
      },
      error: (err) => {
        console.error('Flight submission failed:', err);
      }
    });
  }




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

  openAddFlightModal() {
    this.showAddFlightModal = true;
  }

  // Close the modal
  closeAddFlightModal() {
    this.showAddFlightModal = false;
  }
}
