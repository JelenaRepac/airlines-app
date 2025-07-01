// src/app/services/seats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {
    private apiUrlFlightSchedule = environment.apiUrlFlightSchedule;
  
  

  constructor(private http: HttpClient) {}

  getSeats(): Observable<FlightScheduleSeatInformationOutputDto[]> {
    const token = localStorage.getItem('token'); // Adjust key if needed
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<FlightScheduleSeatInformationOutputDto[]>(this.apiUrlFlightSchedule, { headers })
      .pipe(catchError(this.handleError));
  }

   getSeatsByFlightSchedule(flightScheduleId : number | undefined): Observable<FlightScheduleSeatInformationOutputDto[]> {
    const token = localStorage.getItem('authToken'); // Adjust key if needed
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrlFlightSchedule}/seat/${flightScheduleId}`;

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
