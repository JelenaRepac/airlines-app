import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // SweetAlert2 for alerts
import { AuthService } from '../../service/auth.service';
import { SharedModules } from '../../shared.module';
import { ReservationComponent } from "../booking/reservation.component";
import { User } from '../../models/user.model';
import { VoucherComponent } from "../voucher/voucher.component";
import { UploadService } from '../../service/passport.service';
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { CountryService } from '../../service/country.service';
import { Country } from '../../models/country.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [SharedModules, ReservationComponent, VoucherComponent, MatSelectModule, FormsModule, ReactiveFormsModule, MatAutocomplete, MatAutocompleteModule]
})
export class ProfileComponent implements OnInit {
  user!: User;

  readonlyMode: boolean = true;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

countryControl = new FormControl<Country | string | null>(null);
  countries: Country[] = []; // your country list
  filteredCountries!: Observable<Country[]>; selectedCountry: string | null = null;

  constructor(private authService: AuthService,
    private router: Router,
    private uploadService: UploadService,
    private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCountries();

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(null),
      map(value => typeof value === 'string' ? value : value?.name ?? ''),
      map(name => name ? this._filterCountries(name) : this.countries.slice())
    );

     this.countryControl.disable();
  
  }
  toggleReadonly() {
  this.readonlyMode = !this.readonlyMode;

  if (this.readonlyMode) {
    this.countryControl.disable();
  } else {
    this.countryControl.enable();
  }
}
  private _filterCountries(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  displayCountry(country: Country | null): string {
    return country ? country.name : '';
  }
  loadCountries(): void {
    this.countryService.getCountries().subscribe((response) => {
      if (!response.error) {
        this.countries = response;
      }
    });
  }
  checkPendingUpload(): void {
    const userIdStr = localStorage.getItem("userId");
    const fileName = localStorage.getItem("pendingFileName");
    const fileBytes = localStorage.getItem("pendingFileBytes");

    if (userIdStr && fileName && fileBytes) {
      const byteArray = new Uint8Array(JSON.parse(fileBytes));
      const file = new File([byteArray], fileName);

      this.uploadService.uploadFile(file, +userIdStr).subscribe({
        next: () => {
          console.log('✅ File uploaded successfully');
          localStorage.removeItem("pendingFileName");
          localStorage.removeItem("pendingFileBytes");
          this.loadUserProfile();
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
        }
      });
    }
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
  uploadDocument(): void {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    const userIdStr = localStorage.getItem("userId");
    const userId = userIdStr ? +userIdStr : null;

    if (userId !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        localStorage.setItem("pendingFileName", this.selectedFile!.name);
        localStorage.setItem("pendingFileBytes", JSON.stringify(Array.from(byteArray)));

        this.uploadService.getOAuthLink(userId).subscribe({
          next: (oauthUrl) => {
            this.goToLink(oauthUrl);

            setTimeout(() => {
              this.checkPendingUpload();
            }, 2000);
            this.selectedFileName = '';
          },
          error: (err) => {
            console.error('Failed to get OAuth URL', err);
          }
        });

      };
      reader.readAsArrayBuffer(this.selectedFile);
    } else {
      console.error('User ID not found in localStorage.');
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }
  onSubmit() {

    this.authService.updateUserInfo(this.user).subscribe({
      next: () => {
        this.uploadDocument();
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


  downloadPassport(userId: number, documentName: string): void {
    this.uploadService.openDocument(userId, documentName).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading document', err);
      }
    });
  }


}