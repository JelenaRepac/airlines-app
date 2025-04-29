import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = environment.apiUrl + '/flight/countries';  
  private accessKey = environment.accessKey;  

  constructor(private http: HttpClient) {}

  getCountries(offset: number, limit: number): Observable<Country[]> {
    const params = { accessKey: this.accessKey, offset: String(offset), limit: String(limit) };
    return this.http
      .get<Country[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));  // Add error handling
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
