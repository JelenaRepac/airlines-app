import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { AuthService } from '../service/login.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [FormsModule, CommonModule, HttpClientModule,   RouterModule, ],  // Include CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';  
  password: string = ''; 
  errorMessage: string = ''; 
  
  constructor(private authService: AuthService,  private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Both username and password are required!';
    } else {
      this.errorMessage = '';
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          
          console.log('Login successful:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials. Please try again.';
        },
      });
    }
  }
}
