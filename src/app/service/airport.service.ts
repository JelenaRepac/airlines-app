import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { environment } from '../environment';




@Injectable({
  providedIn: 'root',
})
export class AirportService {
    private apiAirportUrl = `${environment.airportUrl}`;


  constructor(private http: HttpClient) { }

 
 getAirportsByCountry(countryCode: string): Observable<any> {
  const token = localStorage.getItem('authToken');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const params = new HttpParams().set('countryCode', countryCode);

  return this.http.get(`${this.apiAirportUrl}/country`, {
    headers,
    params
  }).pipe(
    catchError(this.handleError)
  );
}


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
