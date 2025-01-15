import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table'; // Import the MatTableModule
import { MatButtonModule } from '@angular/material/button'; // If you use buttons
import { MatPaginatorModule } from '@angular/material/paginator'; // If you need pagination
import { MatSortModule } from '@angular/material/sort'; // If you need sorting
import {MatTabsModule} from '@angular/material/tabs'

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
    MatTableModule, // Make sure MatTableModule is imported
    MatButtonModule, // If you use buttons
    MatPaginatorModule, // If you need pagination
    MatSortModule, // If you need sorting,
    MatTabsModule
  ],
})
export class FlightsComponent {
  displayedColumns: string[] = ['fromCity', 'toCity', 'departureTime', 'price']; // List of columns to display
  
  flights = [
    {
      flightNumber: 'AA123',
      fromCity: 'New York',
      toCity: 'Los Angeles',
      departureDate: '2025-01-20',
      departureTime: '2025-01-20T08:00:00Z', // ISO 8601 format, or use your desired time format
      status: 'On Time',
      price: 299.99
    },
    {
      flightNumber: 'BB456',
      fromCity: 'Chicago',
      toCity: 'Miami',
      departureDate: '2025-01-21',
      departureTime: '2025-01-21T12:30:00Z',
      status: 'Delayed',
      price: 199.99
    }
  ];
}