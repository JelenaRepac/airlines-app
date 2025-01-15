import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';  // Import AuthService
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
   imports: [FormsModule, CommonModule ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  passportNumber: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}  // Inject AuthService

  onSubmit() {
    console.log('Submit button clicked');
    this.resetMessages();
  

    if (!this.firstname || !this.lastname || !this.password || !this.email || !this.passportNumber) {
      this.errorMessage = 'All fields are required!';
      return;
    }
  
    const userData = { 
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username, 
      password: this.password, 
      passportNumber: this.passportNumber,
      email: this.email 
    };
  
    this.authService.register(userData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please check your email to confirm your account.',
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: `Error: ${error.message}`,
        });
      },
    });
  }
  
  onInput(event: Event, field: 'username' | 'password' | 'email' | 'firstname' | 'lastname' | 'passportNumber') {
    const inputElement = event.target as HTMLInputElement;
    this[field] = inputElement.value;
  }

  private resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }


  private resetForm() {
    this.firstname = '';
    this.lastname = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.passportNumber = '';
  }
}
