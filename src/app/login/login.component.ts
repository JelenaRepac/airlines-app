import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { SharedModules } from '../shared.module';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  imports: [SharedModules],  // Include CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }



  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required!';
    } else {
      this.authService.isAdmin();
      this.errorMessage = '';

       
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          
          this.authService.getProfile(this.email).subscribe({
            next: (profile) => {
              console.log('Profile:', profile);

              localStorage.setItem('userId', profile.id); // assuming profile contains `id`
              console.log('USERRRRRR ' + localStorage.getItem('userId'));
              localStorage.setItem('email', profile.email);
              Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back! You have successfully logged in.',
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                toast: true,
              }).then(() => {
                this.router.navigate(['airline/home']);
              });
            },
            error: (err) => {
              console.error('Error fetching profile:', err);
            }
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
