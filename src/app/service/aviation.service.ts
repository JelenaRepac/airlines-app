// aviation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AviationService {

  private baseUrl = 'http://localhost:9090/api/aviation'; // adjust if needed

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/countries`);
  }

  getCities(countryIso: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cities`, {
      params: { countryIso }
    });
  }

  getAirports(iataCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/airports`, {
      params: { iataCode }
    });
  }
}
