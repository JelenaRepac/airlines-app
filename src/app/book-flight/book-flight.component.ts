import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../service/flight.service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AirplaneSeatsComponent } from "../airplane-seats/airplane-seats.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { ScheduleService } from '../service/schedule.service';
import { ScheduleDto } from '../models/schedule-dto.model';
import { ScheduleInput } from '../models/schedule-input.model';
import {CommonModule} from "@angular/common";
@Component({
    selector: 'app-book-flight',
    templateUrl: './book-flight.component.html',
    styleUrl:'./book-flight.component.css',
    imports: [MatTab, MatTabGroup, AirplaneSeatsComponent, NavbarComponent, CommonModule]
})
export class BookFlightComponent implements OnInit {
    flightScheduleId!: number;
    flightInfo: any; // Replace with actual type
    schedule! : ScheduleInput;

    constructor(private route: ActivatedRoute, private flightService: FlightService, private scheduleService: ScheduleService) { }

    ngOnInit(): void {
        this.flightScheduleId = +this.route.snapshot.paramMap.get('id')!;

        this.scheduleService.getScheduleById(this.flightScheduleId).subscribe({
            next: (schedule) => {
                this.schedule = schedule;
            },
            error: (err) => {
                console.error('Failed to load schedule', err);
            }
        });

    }
}
