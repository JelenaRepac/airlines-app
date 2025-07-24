import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Get user role from decoded JWT token
  getUserRole(): string {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || '';
    }
    return '';
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';  // Compare role to 'ROLE_ADMIN'
  }

  // Login and store token in localStorage
  login(email: string, password: string): Observable<any> {
    console.log(this.apiUrl);
    return this.http.post<any>(`http://localhost:8000/login`, { email, password }).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
        }
      }),
      catchError(this.handleError)  // Handle errors globally
    );
  }

  // Check if the token is valid based on expiration
  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken = this.decodeToken(token);
    return decodedToken && decodedToken.exp > Date.now() / 1000;
  }

  // Decode JWT token to retrieve payload
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        return JSON.parse(atob(payload));
      }
    } catch (e) {
      return null;  // Return null if token is malformed
    }
    return null;
  }

  // Logout user by removing token from localStorage
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post( `${this.apiUrl}/register`, userData).pipe(
      catchError((error: HttpErrorResponse) => {
        const backendMessage = error.error?.message || 'Unknown error ocurred!';
        return throwError(() => new Error(backendMessage));
      })
    );
  }

  twoFactorAuthentication(twoFactor: any): Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(
      `${this.apiUrl}/2fa/verify`,
      twoFactor,
      { headers }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const backendMessage = error.error?.message || 'Unknown error occurred!';
        return throwError(() => new Error(backendMessage));
      })
    );
  }

  // Retrieve the stored token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Get the user's profile by email
   getProfile(email: string ): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      params: { email }
    }).pipe(catchError(this.handleError));
  }

  // Extract email from the JWT token
  getEmailFromToken(): string  {
    const decodedToken = this.decodeToken(this.getToken()!);
    return decodedToken.sub;
  }

  // Update user information
  updateUserInfo(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, userData, {
    }).pipe(catchError(this.handleError));
  }

  // Fetch all admins
  getAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`, {
    }).pipe(catchError(this.handleError));
  }

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
    }).pipe(catchError(this.handleError));
  }

  // Add a new admin
  addAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin`, userData, {
    }).pipe(catchError(this.handleError));
  }

  // Delete an admin by ID
  deleteAdmin(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${userId}`, {
    }).pipe(catchError(this.handleError));
  }

  // Create authorization headers for HTTP requests
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Global error handler
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = this.getErrorMessageBasedOnStatus(error.status, error.error?.message);
    }

    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Return a user-friendly error message based on status
  private getErrorMessageBasedOnStatus(status: number, serverMessage?: string): string {
    switch (status) {
      case 400: return 'Invalid input data. Please check your details.';
      case 404: return 'Requested resource not found.';
      case 500:
        return serverMessage === 'User with that email already exists'
          ? 'A user with this email already exists. Please try another email.'
          : 'A server error occurred. Please try again later.';
      default: return 'An unknown error occurred!';
    }
  }
}
