import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlightInformationDto } from '../models/flight.model';
import { environment } from '../environment';
import { AuthService } from './auth.service';
import { ScheduleDto } from '../models/schedule-dto.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightUrl = environment.apiUrlFlight;
  private flightScheduleUrl = environment.apiUrlFlightSchedule;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Add a new flight
  addFlight(flight: FlightInformationDto): Observable<FlightInformationDto> {
    return this.http
      .post<FlightInformationDto>(this.flightUrl, flight)
      .pipe(catchError(this.handleError));
  }

  // Get all flights
  getFlights(): Observable<FlightInformationDto[]> {
    return this.http
      .get<FlightInformationDto[]>(this.flightUrl)
      .pipe(catchError(this.handleError));
  }

  // dinamically get flight schedules

getSchedulesDinamically(
  from?: string,
  to?: string,
  departureDate?: string,
  arrivalDate?: string
): Observable<ScheduleDto[]> {
  let params = new HttpParams();

  console.log(params);
  if (from) {
    params = params.set('from', from);
  }

  if (to) {
    params = params.set('to', to);
  }

  if (departureDate) {
    params = params.set('departureDate', departureDate);
  }

  if (arrivalDate) {
    params = params.set('arrivalDate', arrivalDate);
  }

  // const token = localStorage.getItem('authToken'); 

  // const headers = new HttpHeaders({
  //   Authorization: `${token}`
  // });

  return this.http.get<ScheduleDto[]>(`${this.flightScheduleUrl}`, { params });
}


  getFlightScheduleByid(id: number): Observable<any> {
    const token = localStorage.getItem('authToken'); 

    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.flightScheduleUrl}/${id}`, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a flight by ID
  deleteFlight(flightId: number): Observable<any> {
    return this.http
      .delete(`${this.flightUrl}/${flightId}`)
      .pipe(catchError(this.handleError));
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid input data. Please check your details.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = error.error?.message === 'Flight with that name already exists'
            ? 'A flight with this name already exists. Please try another name.'
            : 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
