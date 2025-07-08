import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../service/flight.service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AirplaneSeatsComponent } from "../airplane-seats/airplane-seats.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { ScheduleService } from '../service/schedule.service';
import { ScheduleInput } from '../models/schedule-input.model';
import { CommonModule } from "@angular/common";
import { MatStep } from '@angular/material/stepper';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { TicketViewComponent } from '../ticket/ticket-view.component';
import { ReservationComponent } from "../reservation-info/reservation.component";
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';

@Component({
    selector: 'app-book-flight',
    templateUrl: './book-flight.component.html',
    styleUrl: './book-flight.component.css',
    imports: [MatStep,
        MatStepperModule,
        AirplaneSeatsComponent,
        NavbarComponent,
        ReactiveFormsModule,
        CommonModule,
        TicketViewComponent, ReservationComponent]
})
export class BookFlightComponent implements OnInit {
    flightScheduleId!: number;
    flightInfo: any; // Replace with actual type
    schedule: ScheduleInput[] = [];
    constructor(private route: ActivatedRoute, private fb: FormBuilder, private flightService: FlightService, private scheduleService: ScheduleService) { }

    flightInfoForm!: FormGroup;



    ngOnInit(): void {
        this.flightInfoForm = this.fb.group({});
        this.flightScheduleId = +this.route.snapshot.paramMap.get('id')!;

        this.loadScheduleListById(this.flightScheduleId);
    }

    loadScheduleListById(scheduleId: number): void {
        this.scheduleService.getScheduleById(scheduleId).subscribe({
            next: (schedules: any) => {
                console.log('Fetched schedule:', schedules);
                this.schedule = Array.isArray(schedules) ? schedules : [schedules];
            },
            error: (err) => {
                console.error('Failed to load schedules', err);
            }
        });
    }

    selectedSeat: FlightScheduleSeatInformationOutputDto | null = null; 

    onSeatSelected(seat: FlightScheduleSeatInformationOutputDto) {
        this.selectedSeat = seat;
        console.log('Selected seat:', seat);
    }
}



