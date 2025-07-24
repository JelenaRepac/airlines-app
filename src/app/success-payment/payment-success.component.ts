// payment-success.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../service/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private  checkoutService: CheckoutService, private router: Router) {}

  ngOnInit(): void {
    this.sendConfirmationEmail();
    setTimeout(() => {
      this.router.navigate(['/airline/book-flight']);
    }, 3000);
  }

  private sendConfirmationEmail(): void {
    this.checkoutService.sendConfirmationMail();
  }
}
