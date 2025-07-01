import { ScheduleService } from '../../service/schedule.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedModules } from '../../shared.module';
import { Router } from '@angular/router';
import { ScheduleDto } from '../../models/schedule-dto.model';
import { ScheduleInput } from '../../models/schedule-input.model';

@Component({
  selector: 'flight-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports: [SharedModules]
})
export class FlightScheduleComponent implements OnInit, OnChanges {
  flightSchedules: ScheduleInput[] = [];
  isAdmin: boolean = true;

  @Input() schedules: ScheduleDto[] = [];
  @Input() panelOpen: boolean = false;
  @Input() newSchedule: ScheduleInput | null = null;

  displayedColumns: string[] = ['flight', 'status', 'arrivalDeparture', 'sourceDestination', 'actions'];




  constructor(private scheduleService: ScheduleService, private router: Router,
    private flightSelectionService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
    console.log(this.flightSchedules);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newSchedule'] && this.newSchedule) {
      this.loadSchedules(); // <-- reload from backend
    }
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (data) => this.flightSchedules = data,

      error: (err) => console.error('Failed to load schedules', err)
    });
  }



  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
  onButtonClick(flightScheduleId: number | undefined): void {
    this.flightSelectionService.setSelectedFlightId(flightScheduleId);
    this.router.navigate(['airline/book-seats']); // Pass ID as route param
  }


}
