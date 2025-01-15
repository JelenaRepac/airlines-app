import {ChangeDetectionStrategy, Component} from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range.component.html',
  imports: [MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRange {}
