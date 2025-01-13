import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true, // Mark as standalone
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout(): void {
    console.log('User logged out');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}