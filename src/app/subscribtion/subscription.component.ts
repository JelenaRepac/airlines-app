import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  imports:[ReactiveFormsModule]
})
export class SubscriptionCardComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [''],
      email: [''],
      agree: [false]
    });
  }

  onSubmit() {
    if (this.form.valid && this.form.value.agree) {
      console.log('Subscribed:', this.form.value);
    }
  }
}
