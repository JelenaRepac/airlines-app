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

  displayedColumns: string[] = ['flight', 'status', 'arrivalDeparture', 'sourceDestination', 'actions'];
  dataSource = new MatTableDataSource<ScheduleDto>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;


  }


  constructor(private scheduleService: ScheduleService, private router: Router,
    private flightSelectionService: ScheduleService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
    console.log(this.schedules);
    this.isAdmin = this.authService.isAdmin();
    console.log(this.isAdmin);

    //  this.displayedColumns = this.isAdmin
    // ? ['flight', 'status', 'arrivalDeparture', 'sourceDestination', 'actions']
    // : ['flight', 'status', 'arrivalDeparture', 'sourceDestination'];

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


  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;

      // Reinitialize data source
      this.dataSource = new MatTableDataSource(this.schedules);

      // Sorting accessor
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

      // Delay sort assignment to wait for view init
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
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