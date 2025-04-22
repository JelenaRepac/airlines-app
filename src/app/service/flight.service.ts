import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { FlightInformationDto } from '../models/flight.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private flightUrl = 'http://localhost:9090/flight'; // adjust if needed

  constructor(private http: HttpClient) { }

  addFlight(flight: FlightInformationDto): Observable<FlightInformationDto> {
    return this.http.post<FlightInformationDto>(this.flightUrl, flight);
  }

  getFlights(): Observable<FlightInformationDto[]> {
    return this.http.get<FlightInformationDto[]>(`${this.flightUrl}`);

  }


  deleteFlight(flightId: number): Observable<any> {
    return this.http.delete(
      `${this.flightUrl}/${flightId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

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
          errorMessage = error.error?.message === 'Flight with that name already exists'
            ? 'A flight with this name already exists. Please try another name.'
            : 'A server error occurred. Please try again later.';
          break;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
