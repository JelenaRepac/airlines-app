import { ScheduleService } from '../../service/schedule.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SharedModules } from '../../shared.module';
import { Router } from '@angular/router';
import { ScheduleDto } from '../../models/schedule-dto.model';
import { ScheduleInput } from '../../models/schedule-input.model';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { PricingService } from '../../service/pricing.service';
@Component({
  selector: 'flight-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports: [SharedModules, MatSortModule]
})
export class FlightScheduleComponent implements OnInit, OnChanges, AfterViewInit {

  isAdmin: boolean = false;

  @Input() schedules: ScheduleDto[] = [];
  @Input() panelOpen: boolean = true;
  @Input() newSchedule: ScheduleInput | null = null;

  displayedColumns: string[] = ['flight', 'status', 'arrivalDeparture', 'sourceDestination','actions'];
  dataSource = new MatTableDataSource<ScheduleDto>([]);



  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;


  }


  constructor(private scheduleService: ScheduleService, private router: Router,
    private flightSelectionService: ScheduleService,
    private authService: AuthService,
    private pricingService:PricingService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
    console.log(this.schedules);

    this.isAdmin = this.authService.isAdmin();
    console.log(this.isAdmin);

  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['schedules'] && this.schedules) {
      this.dataSource.data = this.schedules;
      this.dataSource.sort = this.sort;
    }

    if (changes['newSchedule'] && this.newSchedule) {
      this.loadSchedules();
    }

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'flight':
          return item.flightInformation?.flightName?.toLowerCase() || '';
        case 'status':
          return item.status || '';
        case 'arrivalDeparture':
          return item.arrivalDate || '';
        case 'sourceDestination':
          return `${item.startAirport || ''} ${item.endAirport || ''}`;
        default:
          return (item as any)[property] ?? '';
      }
    };
  }


onSortChange(): void {
  setTimeout(() => {
    if (this.dataSource.filteredData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No sorted results',
        text: 'No schedules match the selected sort criteria.',
      });
    }
  });
}


  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;

        if (schedules.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No schedules found',
            text: 'There are no flight schedules for the selected criteria.',
          });
        }

        this.dataSource = new MatTableDataSource(this.schedules);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'flight':
              return item.flightInformation?.flightName?.toLowerCase() || '';
            case 'status':
              return item.status || '';
            case 'arrivalDeparture':
              return item.arrivalDate || '';
            case 'sourceDestination':
              return `${item.startAirport || ''} ${item.endAirport || ''}`;
            default:
              return (item as any)[property] ?? '';
          }
        };


        // Set sort after table is rendered
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error loading schedules',
          text: 'Please try again later.',
        });
      }
      
    });
    
  }





  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
  onButtonClick(flightScheduleId: number | undefined): void {
    this.flightSelectionService.setSelectedFlightId(flightScheduleId);
    this.router.navigate(['airline/app-book-flight', flightScheduleId]); // Pass ID as route param
  }


}