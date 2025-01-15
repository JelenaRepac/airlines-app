import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightSelectorComponent } from '../flight-selector/flight-selector.component';
import { FlightsComponent } from "../flights/flights.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavbarComponent, FlightSelectorComponent, FlightsComponent]
})
export class HomeComponent {
  title = 'AIRLINE';

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['/login']); 
  }
}
