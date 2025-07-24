// import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
// import { MatCard, MatCardContent } from '@angular/material/card';
// import { MatIcon } from '@angular/material/icon';
// import { CommonModule } from '@angular/common'
// import { ScheduleInput } from '../models/schedule-input.model';
// import { PricingService } from '../service/pricing.service';
// import { TicketViewComponent } from '../ticket/ticket-view.component';
// import { ScheduleDto } from '../models/schedule-dto.model';
// import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
// import { AuthService } from '../service/auth.service';
// import { MatFormField, MatLabel } from "@angular/material/form-field";
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { VoucherService } from '../service/voucher.service';
// import { MatInputModule } from '@angular/material/input';

// @Component({
//   selector: 'app-reservation',
//   templateUrl: './reservation.component.html',
//   styleUrls: ['./reservation.component.css'],
//   standalone: true,
//   imports: [TicketViewComponent, CommonModule, FormsModule, MatInputModule],
// })
// export class ReservationComponent {

//   @Output() reservationCreated = new EventEmitter<any>();

//   @Input() scheduleList: ScheduleDto[] = [];
//   @Input() selectedSeat!: FlightScheduleSeatInformationOutputDto | null;


//   constructor( private authService:  AuthService, private voucherService: VoucherService){
   
//   };
  


//    ngOnInit(): void {
//     console.log(this.selectedSeat?.seatNumber);
//     this.getUserIdAndEmitReservation();
//   }

//   getUserIdAndEmitReservation(): void {
//     const email = this.authService.getEmailFromToken();
//     this.authService.getProfile(email).subscribe({
//       next: (user) => {
//         const userId = user.id; 

//         const reservation = {
//           flightScheduleId: this.scheduleList[0]?.id,
//           seatNumber: this.selectedSeat,
//           userId: userId,
//           reservedAt: new Date().toISOString().split('Z')[0]
//         };

//         this.reservationCreated.emit(reservation);
//       },
//       error: (err) => {
//         console.error('Failed to fetch user profile:', err);
//       }
//     });
//   }

// }

