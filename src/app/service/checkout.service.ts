import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = environment.apiUrlPayment;
  constructor(private http: HttpClient) { }

createCheckoutSession(amount: number, userEmail: string | null, reservationIds: number [], currency: string) {
  const body = {
    amount: amount,
    email: userEmail,
    reservationId: reservationIds,
    currency: currency
  };
  return this.http.post<{ id: string }>(
    `${this.apiUrl}/create-checkout-session`,
    body
  );
}

sendConfirmationMail() {
  const email = localStorage.getItem('email');

  console.log(email);
  if (email) {
    const params = new HttpParams().set('email', email);

    this.http.post(`${this.apiUrl}/send-confirmation-mail`, null, { params })
      .subscribe({
        next: () => console.log('Confirmation email sent.'),
        error: (err) => console.error('Failed to send confirmation email:', err)
      });
  } else {
    console.error('Email not found in localStorage.');
  }
}



  
}
