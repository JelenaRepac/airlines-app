import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // SweetAlert2 for alerts
import { AuthService } from '../../service/auth.service';
import { SharedModules } from '../../shared.module';
import { ReservationComponent } from "../booking/reservation.component";
import { User } from '../../models/user.model';
import { VoucherComponent } from "../voucher/voucher.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [SharedModules, ReservationComponent, VoucherComponent]
})
export class ProfileComponent implements OnInit {
  user!: User;

  readonlyMode: boolean = true;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  constructor(private authService: AuthService, private router: Router) { }

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



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
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
