import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private api = environment.apiUrl;
  private apiUrl = environment.apiUrl + '/auth';


  constructor(private http: HttpClient) { }

  // get user role
  getUserRole(): string {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      console.log(decodedToken.roles);
      return decodedToken.roles;
    }
    return '';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';  // Compare role to 'admin'
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
  /** Logs out user by removing token */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /** Registers a new user */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /** Retrieves stored token */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /** Fetches user profile by email */
  getProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders(),
      params: { email }
    }).pipe(catchError(this.handleError));
  }

  /** Extracts email from token */
  getEmailFromToken(): string | null {
    const decodedToken = this.decodeToken(this.getToken()!);
    return decodedToken ? decodedToken.sub : null;
  }

  /** Updates user info */
  updateUserInfo(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  /** Fetches all admins */
  getAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }


  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  /** Constructs authentication headers */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `${token}` : ''
    });
  }

  /** Handles API errors */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid input data. Please check your details.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = error.error?.message === 'User with that email already exists'
            ? 'A user with this email already exists. Please try another email.'
            : 'A server error occurred. Please try again later.';
          break;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  addAdmin(userData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin`,
      userData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdmin(userId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/admin/${userId}`,
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(
      catchError(this.handleError)
    );
  }
  
}