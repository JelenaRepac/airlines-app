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

@Component({
    standalone: true,
    selector: 'reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.css'],
    imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule]
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


    constructor(private reservationService: ReservationService, private flightService: FlightService) { }
    reservations: any[] = [];
    pastReservations: any[] = [];
    nextReservations: any[] = [];

    selectedTab: 'past' | 'future' = 'future';

    ngOnInit(): void {
        const userId = 87; // or get it from a logged-in user context
        this.reservationService.getResrvationByUserId(userId).pipe(
            switchMap((reservations: any[]) => {
                const flightScheduleObservables = reservations.map(reservation =>
                    this.flightService.getFlightScheduleByid(reservation.flightScheduleId)
                );

                return forkJoin(flightScheduleObservables).pipe(
                    map(flightSchedules => {
                        return reservations.map((res, index) => ({
                            ...res,
                            flightSchedule: flightSchedules[index]
                        }));
                    })
                );
            }),
            catchError(err => {
                console.error('Failed to fetch reservations or flight schedules:', err);
                return [];
            })
        ).subscribe({
            next: (enrichedReservations) => {
                this.reservations = enrichedReservations;
                this.separateReservationsByDate(this.reservations);
            },
            error: (err) => {
                console.error('Subscription error:', err);
            }
        });
    }

    separateReservationsByDate(reservations: any[]): void {
        const now = new Date();

        this.pastReservations = [];
        this.nextReservations = [];

        for (const res of reservations) {
            const departureDateTime = new Date(`${res.flightSchedule?.departureDate}T${res.flightSchedule?.departureTime}`);
            const arrivalDateTime = new Date(`${res.flightSchedule?.arrivalDate}T${res.flightSchedule?.arrivalTime}`);

            if (arrivalDateTime < now) {
                this.pastReservations.push(res);
            } else {
                this.nextReservations.push(res);
            }

            console.log('next' + this.nextReservations);
            console.log('past' + this.pastReservations);
        }
    }

    getFlightDuration(departure: string, arrival: string): string {
        const departureTime = new Date(`1970-01-01T${departure}`);
        const arrivalTime = new Date(`1970-01-01T${arrival}`);

        const diffMs = arrivalTime.getTime() - departureTime.getTime();
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    }

    get filteredReservations() {
        const now = new Date();
        return this.reservations.filter(res => {
            const depDate = new Date(`${res.flightSchedule?.departureDate}T${res.flightSchedule?.departureTime}`);
            return this.selectedTab === 'future' ? depDate >= now : depDate < now;
        });
    }
}
