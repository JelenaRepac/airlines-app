import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Country {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

interface Airport {
  id: string;
  name: string;
  iataCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AviationService {

  private baseUrl = 'http://localhost:9090/api/aviation';

  constructor(private http: HttpClient) { }

  // Fetch the list of countries
  getCountries(): Observable<Country[]> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Country[]>(`${this.baseUrl}/countries`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch cities by country ISO code
  getCities(countryIso: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities`, {
      params: { countryIso }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch airports by IATA code
  getAirports(iataCode: string): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.baseUrl}/airports`, {
      params: { iataCode }
    }).pipe(
      catchError(this.handleError)
    );
  }
    getToken() {
    return localStorage.getItem('authToken');
  }


  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request, please check the parameters.';
          break;
        case 404:
          errorMessage = 'Not found, the resource might not exist.';
          break;
        case 500:
          errorMessage = 'Internal server error, please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
