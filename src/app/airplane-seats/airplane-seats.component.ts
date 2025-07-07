// airplane-seats.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { SharedModules } from '../shared.module';
import { SeatsService } from '../service/seats.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../service/schedule.service';

@Component({
  selector: 'airpline-seats',
  templateUrl: './airplane-seats.component.html',
     imports: [SharedModules ],
  styleUrls: ['./airplane-seats.component.css']
})
export class AirplaneSeatsComponent implements OnInit {

  @Input() seats: FlightScheduleSeatInformationOutputDto[] = [];
  flightName: string = '';
  error: string = '';
  constructor(private seatsService: SeatsService,private route: ActivatedRoute, private flightSelectionService : ScheduleService) {}
  ngOnInit(): void {
    
    const flightScheduleId = this.flightSelectionService.getSelectedFlightId();


    this.seatsService.getSeatsByFlightSchedule(flightScheduleId).subscribe({
      next: (data) => {
        this.seats = data;
        if (this.seats.length > 0) {
          this.flightName = this.seats[0].flightSchedule.flightInformation.flightName;
        }
      },
      error: (err) => {
        this.error = err.message;
        console.error('Failed to fetch seats:', err);
      }
    });
  }

  selectSeat(seat: FlightScheduleSeatInformationOutputDto): void {
    if (seat.bookingStatus) return;
    seat.selected = !seat.selected;
  }

  
}
