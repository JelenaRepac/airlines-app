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


    constructor(private reservationService: ReservationService, private flightService: FlightService, private authService: AuthService) { }
    reservations: any[] = [];
    pastReservations: any[] = [];
    nextReservations: ScheduleInput[] = [];

    selectedTab: 'past' | 'future' = 'future';

    ngOnInit(): void {
        const email = this.getEmailFromToken();
        if (!email) return;

        this.authService.getProfile(email).subscribe({
            next: (data) => {
                this.user = data;
                this.userId = this.user.id;

                this.reservationService.getResrvationByUserId(this.userId).pipe(
                    switchMap((reservations: any[]) => {
                        this.reservations = reservations;
                        console.log(reservations);

                        const scheduleRequests = reservations.map(res =>
                            this.flightService.getFlightScheduleByid(res.flightScheduleId)
                        );

                        return forkJoin(scheduleRequests);
                    }),
                ).subscribe({
                    next: (schedules: ScheduleInput[]) => {
                        this.separateReservationsByDate(schedules);
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
    separateReservationsByDate(schedules: ScheduleInput[]): void {
        const now = new Date();
        this.pastReservations = [];
        this.nextReservations = [];

        for (const schedule of schedules) {
            const arrival = new Date(`${schedule.arrivalDate}T${schedule.arrivalTime}`);
            if (arrival < now) {
                this.pastReservations.push(schedule);
            } else {
                this.nextReservations.push(schedule);
            }
        }
    }



    get filteredReservations(): ScheduleInput[] {
        const now = new Date();
        return this.selectedTab === 'future'
            ? this.nextReservations.filter(s => new Date(`${s.departureDate}T${s.departureTime}`) >= now)
            : this.pastReservations.filter(s => new Date(`${s.departureDate}T${s.departureTime}`) < now);
    }
}
