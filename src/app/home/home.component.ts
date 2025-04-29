import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { SharedModules } from '../shared.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [SharedModules]
})
export class HomeComponent {
  title = 'AIRLINE';

  constructor(private router: Router, private auth: AuthService) { }
  isAdminUser = false;


  ngOnInit(): void {
    this.isAdminUser = this.auth.isAdmin();
  }
  navigate() {
    this.router.navigate(['/airline/login']);
  }



  onButtonClick(buttonType: string): void {
    if (buttonType === 'bookFlight') {
      this.router.navigate(['/airline/book-flight']);  // Adjust the route as per your application
    }
    else if (buttonType === 'manageAdmins') {
      this.router.navigate(['/airline/users']);  // Adjust the route as per your application
    }
    else if (buttonType === 'manageFlights') {
      this.router.navigate(['/airline/manage-flight']);  // Adjust the route as per your application

    }
    else if (buttonType === 'manage-schedules') {
      this.router.navigate(['/airline/manage-flight-schedule']);  // Adjust the route as per your application
    }
  }


}

