import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightSelectorComponent } from '../flight-selector/flight-selector.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports :[NavbarComponent, FlightSelectorComponent]
})
export class HomeComponent {
  title = 'AIRLINE';

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['/login']); 
  }
}
