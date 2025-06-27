// src/app/services/seats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {
  private apiUrl = 'http://localhost:9090/api/seats';

  constructor(private http: HttpClient) {}

  getSeats(): Observable<FlightScheduleSeatInformationOutputDto[]> {
    const token = localStorage.getItem('token'); // Adjust key if needed
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<FlightScheduleSeatInformationOutputDto[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

   getSeatsByFlightSchedule(flightScheduleId : number | undefined): Observable<FlightScheduleSeatInformationOutputDto[]> {
    const token = localStorage.getItem('token'); // Adjust key if needed
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/flight-schedule/${flightScheduleId}`;

  return this.http
    .get<FlightScheduleSeatInformationOutputDto[]>(url, { headers })
    .pipe(catchError(this.handleError));
}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
