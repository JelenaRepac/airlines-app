import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { SharedModules } from '../shared.module';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';


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

  constructor(private authService: AuthService, private router: Router) { }
// async ngOnInit() {
//     try {
//       console.log("jej")
//       // Fetch session ID from backend
//       const session = "cs_test_a1CzbMY8ETdTlO0RAqy2jQmLb1qVDnUPUbybA1quJ1PVCl1X7Mpjcmkzbf";

//       // Initialize Stripe
//       const stripe = await loadStripe('pk_test_51Rlm4d4gTxY9zBy15DRAx7EK6UFNH7O1a1TKRykzW7rqyBngRbiM4IgGxsvnXPtrPYF1kmnoBAIU6PjAFgOlEJU100jUPEAasA');
//       if (!stripe) {
//         console.error('Stripe failed to initialize');
//         return;
//       }

//       // Redirect to checkout
//       const result = await stripe.redirectToCheckout({ sessionId: session });

//       if (result.error) {
//         // Show error to user if redirect fails
//         console.error('Stripe redirect error:', result.error.message);
//       }
//             console.log("jej")

//     } catch (err) {
//       console.error('Error during payment init:', err);
//     }
//   }
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
