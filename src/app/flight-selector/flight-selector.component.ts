import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-flight-selector',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatCardModule,MatDatepickerModule],
  templateUrl: './flight-selector.component.html',
  styleUrls: ['./flight-selector.component.scss']
  
})
export class FlightSelectorComponent {
  flightForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.flightForm = this.fb.group({
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required],
      goingDate: ['', Validators.required],
      returnDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.flightForm.valid) {
      console.log(this.flightForm.value);
    }
  }
}
