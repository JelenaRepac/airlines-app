import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common'
import { ScheduleInput } from '../models/schedule-input.model';
import { PricingService } from '../service/pricing.service';
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { VoucherService } from '../service/voucher.service';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  standalone: true,
  imports: [MatCard, MatCardContent, MatIcon, CommonModule, FormsModule, MatInputModule]
})
export class TicketViewComponent {
  @Input() scheduleList: ScheduleInput[] = [];
  @Input() selectedSeat!: FlightScheduleSeatInformationOutputDto | null;

  @Output() reservationCreated = new EventEmitter<any>();



  @Output() voucherChanged = new EventEmitter<string>();
  @Output() finalPriceChanged = new EventEmitter<number>();

  constructor(private pricingService: PricingService, private voucherService: VoucherService, private authService: AuthService) { }
  pricingMap = new Map<number | undefined, { price: number; currency: string }>();

  voucherCode: string = '';
  discountPercentage: number = 0;
  originalPrice: number = 0;
  finalPrice: number = this.originalPrice;



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scheduleList'] && this.scheduleList.length > 0) {
      this.loadPricingData();
    }

  }

  loadPricingData() {
    this.scheduleList.forEach(schedule => {
      this.pricingService.getPriceByScheduleId(schedule.id).subscribe({
        next: (response) => {
          const firstPrice = response[0];
          if (firstPrice) {
            this.pricingMap.set(schedule.id, {
              price: firstPrice.price,
              currency: firstPrice.currency
            });
            this.originalPrice = firstPrice.price;

            console.log(firstPrice);
          }
        }
      });
    });
  }
  getFlightDuration(departureTime: string, arrivalTime: string): string {
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);

    let durationHour = arrHour - depHour;
    let durationMin = arrMin - depMin;

    if (durationMin < 0) {
      durationHour -= 1;
      durationMin += 60;
    }

    return `${durationHour}h ${durationMin}m`;
  }


  onVoucherCodeChange(newCode: string): void {
    if (newCode && newCode.trim().length > 0) {
      this.validateVoucher(newCode.trim());
    }
  }

  validateVoucher(code: string): void {
    this.voucherService.validateVoucher(code).subscribe({
      next: (result) => {
        console.log('Voucher validation result:', result);
        this.voucherService.getVoucherByCode(code).subscribe({
          next: (result) => {
            if (result) {
              this.discountPercentage = result.discountPercentage;
              console.log(this.originalPrice);
              this.finalPrice = this.originalPrice * (1 - this.discountPercentage / 100);
              console.log(this.finalPrice + 'FINALLL')

              this.voucherChanged.emit(code);  // Emit current voucher
              this.finalPriceChanged.emit(this.finalPrice);  // Emit discounted price
            } else {
              this.discountPercentage = 0;
              this.finalPrice = this.originalPrice;

            }
          }
        })
      },
      error: (err) => {
        Swal.fire('Error', 'Vaucher is not valid!', 'error');
        console.error('Voucher validation error:', err);
        this.discountPercentage = 0;
        this.finalPrice = this.originalPrice;
      }
    });
  }







  ngOnInit(): void {
    console.log(this.selectedSeat?.seatNumber);
    this.getUserIdAndEmitReservation();
  }

  getUserIdAndEmitReservation(): void {
    const email = this.authService.getEmailFromToken();
    this.authService.getProfile(email).subscribe({
      next: (user) => {
        const userId = user.id;

        const reservation = {
          flightScheduleId: this.scheduleList[0]?.id,
          seatNumber: this.selectedSeat,
          userId: userId,
          reservedAt: new Date().toISOString().split('Z')[0]
        };

        this.reservationCreated.emit(reservation);
      },
      error: (err) => {
        console.error('Failed to fetch user profile:', err);
      }
    });
  }
}
