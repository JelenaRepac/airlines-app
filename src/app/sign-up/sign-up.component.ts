import { Component, NgModule } from '@angular/core';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { SharedModules } from '../shared.module';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { CountryService } from '../service/country.service';
import { response } from 'express';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SharedModules,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})

export class SignUpComponent {
  countries: { country: string; cities: string[] }[] = [];
  selectedCountry: string | null = null;



  firstname: string = '';
  lastname: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  passportNumber: string = '';
  phoneNumber: string = '';
  birthday: Date | null = null;
  country: string = '';


  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService,
    private router: Router,
    private countryService: CountryService) { }  // Inject AuthService

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((response) => {
      if (!response.error) {
        this.countries = response.data; // čuvamo celu listu objekata
      }
    });

  }

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
      birthday: this.birthday,
      phoneNumber: this.phoneNumber,
      country: this.country,
      email: this.email
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        const show2FAPopup = () => {
          Swal.fire({
            title: 'Two-Factor Authentication',
            html: `
          <p>Scan the QR code below with your Google Authenticator app.</p>
          <img src="data:image/png;base64,${response.qrCodeBase64}" alt="QR Code" style="margin:10px 0; width:200px; height:200px;" />
          <p>Then enter the 6-digit code below:</p>
        `,
            input: 'text',
            inputLabel: 'Authenticator Code',
            inputPlaceholder: 'Enter 6-digit code',
            inputAttributes: {
              maxlength: '6',
              autocapitalize: 'off',
              autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Verify'
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              const totpCode = result.value;
              const body = {
                totpCode: totpCode,
                email: userData.email
              };

              this.authService.twoFactorAuthentication(body).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'success',
                    title: '2FA Verified',
                    text: 'Your account has been fully verified.',
                  }).then(() => {
                    this.router.navigate(['airline/home']);
                  }).then(() => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Signed in successfully!',
                      text: 'Welcome! You have successfully verified your account.',
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 5000,
                      toast: true,
                    })
                  });
                },
                error: (error) => {
                  Swal.fire({
                    icon: 'error',
                    title: '2FA Verification Failed',
                    text: `Error: ${error.message}. Please try again.`,
                  }).then(() => {
                    show2FAPopup();
                  });
                }
              });
            }
          });
        };

        show2FAPopup();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: `Error: ${error.message}`,
        });
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


  private resetForm() {
    this.firstname = '';
    this.lastname = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.passportNumber = '';
  }
}
