import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { AuthService } from '../service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule,],  // Include CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required!';
    } else {
      this.authService.isAdmin();
      this.errorMessage = '';
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {

          console.log('Login successful:', response);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back! You have successfully login in.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          }).then(() => {
            this.router.navigate(['/home']);
          });


        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials. Please try again.';
        },
      });
    }
  }
}
