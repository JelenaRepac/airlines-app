import { Component, Input, SimpleChanges } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common'
import { ScheduleInput } from '../models/schedule-input.model';
import { PricingService } from '../service/pricing.service';
import { TicketViewComponent } from '../ticket/ticket-view.component';
import { ScheduleDto } from '../models/schedule-dto.model';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  standalone: true,
  imports: [ TicketViewComponent,CommonModule],
})
export class ReservationComponent {

  @Input() scheduleList: ScheduleDto[] = [];
 @Input() selectedSeat!: FlightScheduleSeatInformationOutputDto | null ;

}
