import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleDto } from '../../models/schedule.dto';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'flight-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports:[CommonModule,
    MatIconModule,
    FormsModule,
        MatTableModule, // Make sure MatTableModule is imported
        MatButtonModule, // If you use button
        MatIconModule
  ]
})
export class FlightScheduleComponent implements OnInit {
  flightSchedules: ScheduleDto[] = [];
  panelOpen = false;
  isAdmin: boolean = false; 

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadSchedules();
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
}
