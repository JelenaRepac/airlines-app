import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:8000';
  private apiUrl = 'http://localhost:8000/auth';


  constructor(private http: HttpClient) { }  // Inject HttpClient

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { username, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        errorMessage = 'Invalid input data. Please check the entered details.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status === 500) {
        errorMessage = 'A server error occurred. Please try again later.';
      }
    }

    console.error('Error:', error);

    return throwError(() => new Error(errorMessage));
  }
}
