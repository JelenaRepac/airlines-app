import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleDto } from '../models/schedule.dto';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private apiUrl = 'http://localhost:9090/flightSchedule';  // adjust base path

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<ScheduleDto[]> {
    return this.http.get<ScheduleDto[]>(this.apiUrl);
  }

  addSchedule(schedule: ScheduleDto): Observable<ScheduleDto> {
    console.log('POSTing to:', this.apiUrl);

    return this.http.post<ScheduleDto>(this.apiUrl, schedule);
  }
}
