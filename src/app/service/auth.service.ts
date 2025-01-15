import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:8000';
  private apiUrl = 'http://localhost:8000/auth';


  constructor(private http: HttpClient) { }

  // get user role
  getUserRole(): string {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      console.log(decodedToken.role);
      return decodedToken.role;
    }
    return '';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';  // Compare role to 'admin'
  }


  // login pozivanje back a
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
  }


  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken = this.decodeToken(token);

    if (decodedToken && decodedToken.exp < Date.now() / 1000) {
      this.logout();
      return false;
    }
    return true;
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        return JSON.parse(atob(payload));
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
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

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  getProfile(email: string): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found in local storage.');
    }

    return this.http.get(`${this.apiUrl}/profile`, {
      headers: {
        'Authorization': `${token}`
      },
      params: {
        email: email,
      },
    });
  }

  getEmailFromToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in local storage');
      return null;
    }

    try {

      const decodedToken: any = this.decodeToken(token);

      return decodedToken.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  updateUserInfo(userData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); 

    if (!token) {
      console.error('Token not found');
    }

    return this.http.post(`${this.apiUrl}/update`, { user: userData }, {
      headers: {
        'Authorization': `${token}`, 
      },
    });
  }

}
