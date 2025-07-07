import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService } from '../service/subscription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  imports:[ReactiveFormsModule]
})
export class SubscriptionCardComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private subscriptionService: SubscriptionService) {
    this.form = this.fb.group({
      firstName: [''],
      email: [''],
      agree: [false]
    });
  }

     onSubmit() {
    if (this.form.valid && this.form.value.agree) {
      const { firstName, email } = this.form.value;

      this.subscriptionService.subscribeToNewsletter(firstName, email).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Subscription Succeeded',
            text: 'You have successfully signed up for the newsletter.',
          });
          console.log('Subscribed successfully:', response);
        },
        error: (error) => {
          console.error('Subscription failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Subscription Failed',
            text: 'There was an issue signing up. Please try again later.',
          });
        }
      });

      console.log('Subscribed:', this.form.value);
    }
  }
}
