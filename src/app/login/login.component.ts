import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { SharedModules } from '../shared.module';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [SharedModules],  // Include CommonModule here
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

        // Call getProfile to fetch user data
        this.authService.getProfile(this.email).subscribe({
          next: (profile) => {
            console.log('Profile:', profile);

            // Save user ID to localStorage
            localStorage.setItem('userId', profile.id); // assuming profile contains `id`

            // Navigate after successful profile fetch
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
