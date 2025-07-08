import { Component, Input, SimpleChanges } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common'
import { ScheduleInput } from '../models/schedule-input.model';
import { PricingService } from '../service/pricing.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  standalone: true,
  imports: [MatCard, MatCardContent, MatIcon, CommonModule]
})
export class TicketViewComponent {
  @Input() scheduleList: ScheduleInput[] = [];

  constructor(private pricingService: PricingService) { }
  pricingMap = new Map<number | undefined, { price: number; currency: string }>();
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
}
