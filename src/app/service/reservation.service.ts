import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservationUrl = `${environment.reservationUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  //get reservation by user id
  getResrvationByUserId(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // or wherever you store your token

    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.reservationUrl}/user`, {
      headers,
      params: { userId: userId.toString() }  // Always convert numbers to strings here
    }).pipe(
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
          errorMessage = error.error?.message === 'Flight with that name already exists'
            ? 'A flight with this name already exists. Please try another name.'
            : 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
