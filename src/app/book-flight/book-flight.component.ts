import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../service/flight.service';
import { AirplaneSeatsComponent } from "../airplane-seats/airplane-seats.component";
import { ScheduleService } from '../service/schedule.service';
import { ScheduleInput } from '../models/schedule-input.model';
import { CommonModule } from "@angular/common";
import { MatStep } from '@angular/material/stepper';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { TicketViewComponent } from '../ticket/ticket-view.component';
import { ReservationComponent } from "../reservation-info/reservation.component";
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { ReservationService } from '../service/reservation.service';
import Swal from 'sweetalert2';
import { Reservation } from '../models/reservation.model';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { SeatsService } from '../service/seats.service';

@Component({
    selector: 'app-book-flight',
    templateUrl: './book-flight.component.html',
    styleUrl: './book-flight.component.css',
    imports: [MatStep,
        MatStepperModule,
        AirplaneSeatsComponent,
        ReactiveFormsModule,
        CommonModule,
        TicketViewComponent,
        ReservationComponent,
        MatRadioButton,
        MatRadioGroup,
        FormsModule]
})
export class BookFlightComponent implements OnInit {
    flightScheduleId!: number;
    flightInfo: any; 
    schedule: ScheduleInput[] = [];
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private flightService: FlightService,
        private scheduleService: ScheduleService,
        private reservationService: ReservationService,
        private seatService: SeatsService) { }

    flightInfoForm!: FormGroup;
    reservationData!: Reservation;

    flightName: string = '';
    error: string = '';


    selectedSeat: any = null;
    seats: any[] = [];
    
    allowSeatSelection = false;

    seatOption: 'choose' | 'random' = 'choose';


    ngOnChanges() {
        this.handleSeatOptionChange();
    }

    handleSeatOptionChange() {
        if (this.seatOption === 'random') {
            this.assignRandomSeat();
        } else {
            this.seats.forEach(seat => seat.selected = false);
            this.selectedSeat = null;
        }
    }


    assignRandomSeat() {
        const availableSeats = this.seats.filter(seat => !seat.bookingStatus);
        const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
        if (randomSeat) {
            this.selectedSeat = randomSeat;
            this.seats.forEach(seat => seat.selected = false);
            randomSeat.selected = true;
            console.log(randomSeat);
        }
    }
    enableSeatSelection() {
        this.allowSeatSelection = true;
    }



    onReservationCreated(reservation: Reservation) {
        this.reservationData = reservation;

        console.log(reservation);
    }


    ngOnInit(): void {
        this.flightInfoForm = this.fb.group({});
        this.flightScheduleId = +this.route.snapshot.paramMap.get('id')!;

        this.loadScheduleListById(this.flightScheduleId);
        this.loadSeats(this.flightScheduleId);
    }

    loadSeats(flightScheduleId: number | undefined): void {
        this.seatService.getSeatsByFlightSchedule(flightScheduleId).subscribe({
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
        }
        );
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


    onSeatSelected(seat: FlightScheduleSeatInformationOutputDto) {
        if (this.seatOption === 'choose') {
            this.selectedSeat = seat;
            this.seats.forEach(s => s.selected = false);
            seat.selected = true;
            console.log('Selected seat:', seat);
        } else {
            console.log('Cannot select manually when seatOption is random');
        }
    }

    reserve() {
        if (!this.reservationData) {
            console.error('No reservation data available');
            return;
        }
        this.reservationData.seatNumber = this.selectedSeat?.seatNumber ?? '';
        console.log(this.reservationData);

        this.reservationService.createReservation(this.reservationData).subscribe({
            next: (response) => {
                console.log('Reservation successful:', response);
                Swal.fire('Success', 'Reservation created!', 'success');
            },
            error: (error) => {
                console.error('Reservation failed:', error);
                Swal.fire('Error', 'Failed to create reservation', 'error');
            }
        });
    }
}



