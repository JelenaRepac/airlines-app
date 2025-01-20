import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateRange } from './date-range.component';
import { HttpClient } from '@angular/common/http';

interface Country {
  countryId: number;
  countryName: string;
}

@Component({
  selector: 'app-flight-selector',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCardModule, MatDatepickerModule, MatSelectModule, MatButtonModule, MatIconModule, CommonModule,DateRange],
  templateUrl: './flight-selector.component.html',
  styleUrls: ['./flight-selector.component.scss']
})
export class FlightSelectorComponent {
  countries: Country[] = [];  // Use the Country interface to type the array
  selectedCountry: string = '';  // Store the selected country
  accessKey = 'a0c2b52e19dd4518239d16ae667b4c22';
  flightForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.flightForm = this.fb.group({
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required],
      goingDate: ['', Validators.required],
      returnDate: ['', Validators.required],
    });
  }

  onCountryChange() {
    const fromCity = this.flightForm.value.fromCity;
    const toCity = this.flightForm.value.toCity;

    // Check if both cities are selected before making the API call
    if (fromCity && toCity) {
      this.callCountryAPI(fromCity, toCity);
    }
  }

  callCountryAPI(fromCity: string, toCity: string) {
    const url = `http://localhost:9090/flight/flight/country?accessKey=${this.accessKey}}`;
    
    // Call the API and get the list of countries
    this.http.get<Country[]>(url).subscribe(response => {
      console.log('API Response:', response);
      this.countries = response;  // Now TypeScript knows the type of countries
    }, error => {
      console.error('API Error:', error);
    });
  }

  onSubmit(): void {
    if (this.flightForm.valid) {
      console.log(this.flightForm.value);
    }
  }
}
