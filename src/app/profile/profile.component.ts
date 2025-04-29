import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // SweetAlert2 for alerts
import { AuthService } from '../service/auth.service'; 
import { SharedModules } from '../shared.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[SharedModules]
})
export class ProfileComponent implements OnInit {
  user: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    rank: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const email = this.authService.getEmailFromToken();

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No email found in local storage.',
      });
      return; 
    }

    this.authService.getProfile(email).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user profile.',
        });
      },
    });
  }

  onSubmit() {
    this.authService.updateUserInfo(this.user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your account details have been successfully updated.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an issue updating your profile.',
        });
      },
    });
  }


}
