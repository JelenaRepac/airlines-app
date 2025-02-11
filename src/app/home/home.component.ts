import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightSelectorComponent } from '../flight-selector/flight-selector.component';
import { FlightsComponent } from "../flights/flights.component";
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavbarComponent, CommonModule]// FlightSelectorComponent, FlightsComponent]
})
export class HomeComponent {
  title = 'AIRLINE';

  constructor(private router: Router, private auth: AuthService) { }
  isAdminUser = false;


  ngOnInit(): void {
    this.isAdminUser = this.auth.isAdmin();
  }
  navigate() {
    this.router.navigate(['/login']);
  }



  onButtonClick(buttonType: string): void {
    if (buttonType === 'bookFlight') {
      this.router.navigate(['/book-flight']);  // Adjust the route as per your application
    } else if (buttonType === 'flightSchedule') {
      this.router.navigate(['/flight-schedule']);  // Adjust the route as per your application
    }
  }


}

