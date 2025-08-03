// reservation.service.ts
import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';  // <-- import the module
import { NgModule } from '@angular/core';
import { catchError, forkJoin, map, switchMap } from 'rxjs';
import { ReservationService } from '../../service/reservation.service';
import { FlightService } from '../../service/flight.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScheduleInput } from '../../models/schedule-input.model';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { TicketViewComponent } from '../../ticket/ticket-view.component';
import { FlightScheduleSeatInformationOutputDto } from '../../models/flight-schedule-seat.model';
import { Reservation } from '../../models/reservation.model';

@Component({
    standalone: true,
    selector: 'reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.css'],
    imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, TicketViewComponent]
})

export class ReservationComponent implements OnInit {

    displayedColumns: string[] = [
        'id',
        'seatNumber',
        'confirmed',
        'reservedAt',
        'flightName',
        'fromTo',
        'departureArrival',
        'status'
    ];

    user!: User;
    userId!: number;

    selectedSeats: FlightScheduleSeatInformationOutputDto[] = [];

    constructor(private reservationService: ReservationService, private flightService: FlightService, private authService: AuthService) { }
    reservations: Reservation[] = [];
    pastReservations: Reservation[] = [];
    nextReservations: Reservation[] = [];

    selectedTab: 'past' | 'future' = 'future';


    reservedSeat?: string;
    ngOnInit(): void {
        const email = this.getEmailFromToken();
        if (!email) return;

        this.authService.getProfile(email).subscribe({
            next: (data) => {
                this.user = data;
                this.userId = this.user.id;

                this.reservationService.getResrvationByUserId(this.userId).subscribe({
                    next: (reservations: any[]) => {
                        this.reservations = reservations;

                        console.log(reservations);

                        // FlightSchedule is already part of each reservation
                        const schedules: ScheduleInput[] = reservations.map(res => res.flightSchedule);
                        this.separateReservationsByDate(reservations);


                    },
                    error: (err) => {
                        console.error('Failed to load reservations', err);
                    }
                });
            },
            error: (err) => {
                console.error('Failed to load user profile', err);
            }
        });
    }



    getEmailFromToken(): string | null {
        const email = this.authService.getEmailFromToken();
        console.log('Email from token:', email);

        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No email found in token.',
            });
            return null;
        }

        return email;
    }
    separateReservationsByDate(reservations: Reservation[]): void {
        const now = new Date();
        this.pastReservations = [];
        this.nextReservations = [];

        for (const reservation of reservations) {
            const flightSchedule = reservation.flightSchedule;

            if (flightSchedule?.arrivalDate && flightSchedule?.arrivalTime) {
                const arrival = new Date(`${flightSchedule.arrivalDate}T${flightSchedule.arrivalTime}`);

                if (arrival < now) {
                    this.pastReservations.push(reservation);
                } else {
                    this.nextReservations.push(reservation);
                }
            }
        }
    }


    get filteredReservations(): Reservation[] {
        const now = new Date();

        const list = this.selectedTab === 'future' ? this.nextReservations : this.pastReservations;

        return list.filter(s => {
            const schedule = s.flightSchedule;
            if (!schedule || !schedule.departureDate || !schedule.departureTime) {
                return false; // skip if any value is missing
            }

            const departure = new Date(`${schedule.departureDate}T${schedule.departureTime}`);
            return this.selectedTab === 'future'
                ? departure >= now
                : departure < now;
        });
    }
}
