import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { environment } from '../environment';

interface CountryResponse {
  error: boolean;
  msg: string;
  data: { country: string; cities: string[] }[];
}


@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'https://countriesnow.space/api/v0.1/countries';
  private accessKey = environment.accessKey;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<CountryResponse> {
    return this.http.get<CountryResponse>(this.apiUrl);
  }

}
