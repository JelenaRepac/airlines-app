import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
  @Injectable({
    providedIn: 'root',
  })
  export class CountryService {
    private apiUrl = 'http://localhost:9090/flight/countries';
  
    constructor(private http: HttpClient) {}
  
    getCountries(offset: number, limit: number): Observable<Country[]> {
      const accessKey = 'a0c2b52e19dd4518239d16ae667b4c22';
      return this.http.get<Country[]>(`${this.apiUrl}?accessKey=${accessKey}&offset=${offset}&limit=${limit}`);

    }
  }