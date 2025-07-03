import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { ScheduleInput } from '../models/schedule-input.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = environment.apiUrlFlightSchedule;

  private selectedFlightId;


  constructor(private http: HttpClient) { }
  setSelectedFlightId(id: number | undefined): void {
    this.selectedFlightId = id;
  }
  getSelectedFlightId(): number | undefined {
    return this.selectedFlightId;
  }

  // Get all flight schedules
  getSchedules(): Observable<ScheduleInput[]> {
    return this.http
      .get<ScheduleInput[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Add a new flight schedule
  addSchedule(schedule: ScheduleInput): Observable<ScheduleInput> {
    const token = localStorage.getItem("authToken");

    console.log(schedule);
    console.log('POSTing to:', this.apiUrl);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http
      .post<ScheduleInput>(this.apiUrl, schedule, { headers })
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
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
