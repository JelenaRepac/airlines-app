import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/auth'; 
    constructor(private http: HttpClient) {}  // Inject HttpClient
  
    login(username: string, password: string): Observable<any> {
      // Replace with actual login API call
      return this.http.post(`${this.apiUrl}/login`, { username, password });   
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}