// airplane-seats.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { SharedModules } from '../shared.module';
import { SeatsService } from '../service/seats.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../service/schedule.service';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'airpline-seats',
  templateUrl: './airplane-seats.component.html',
  imports: [SharedModules],
  styleUrls: ['./airplane-seats.component.css']
})
export class AirplaneSeatsComponent  {

  @Output() seatSelected = new EventEmitter<FlightScheduleSeatInformationOutputDto>();

  @Input() seats: FlightScheduleSeatInformationOutputDto[] = [];

  selectSeat(seat: FlightScheduleSeatInformationOutputDto) {
    if (!seat.bookingStatus) {
      this.seats.forEach(s => s.selected = false);
      seat.selected = true;
      this.seatSelected.emit(seat); 
    }
  }

}
