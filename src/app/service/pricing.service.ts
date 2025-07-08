import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { Price } from '../models/pricing.model';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private apiUrl = environment.apiUrlPricing;
  constructor(private http: HttpClient) {}

  
getPriceByScheduleId(scheduleId: number | undefined): Observable<Price> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const url = `${this.apiUrl}/schedule/${scheduleId}`;

  console.log('Calling pricing API for schedule ID:', scheduleId);

  return this.http.get<Price>(url, { headers }).pipe(
    catchError(this.handleError)
  );
}




  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid input data. Please check your details.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
