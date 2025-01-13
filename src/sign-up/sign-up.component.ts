import { Component } from '@angular/core';
import { AuthService } from '../login/login.service';  // Import AuthService
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common'; 

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
  
    if (!this.isFormValid()) {
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
      next: (response) => {
        this.successMessage = 'Sign-up successful! You must confirm your user in the mail.';
        console.log('Sign-up successful:', response);
        this.resetForm();  // Reset form after successful submission
      },
      error: (err) => {
        if (err.error && err.error.message) {
          // If backend error contains a message, display it
          this.errorMessage = err.error.message;
        } else {
          // Default error message if no specific message is provided
          this.errorMessage = 'Sign-up failed. Please try again.';
        }
        console.error('Error:', err);
      }
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

  public isFormValid(): boolean {
    return !!this.firstname && !!this.lastname && !!this.username && !!this.password && !!this.email && !!this.passportNumber;
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
