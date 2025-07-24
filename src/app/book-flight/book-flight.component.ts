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
// import { ReservationComponent } from "../reservation-info/reservation.component";
import { FlightScheduleSeatInformationOutputDto } from '../models/flight-schedule-seat.model';
import { ReservationService } from '../service/reservation.service';
import Swal from 'sweetalert2';
import { Reservation } from '../models/reservation.model';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { SeatsService } from '../service/seats.service';
import { CheckoutService } from '../service/checkout.service';
import { loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { PricingService } from '../service/pricing.service';
import { response } from 'express';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { VoucherService } from '../service/voucher.service';

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
        // ReservationComponent,
        MatRadioButton,
        MatRadioGroup,
        FormsModule, MatInputModule]
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
        private seatService: SeatsService,
        private checkoutService: CheckoutService,
        private pricingService: PricingService,
        private voucherService: VoucherService) { }

    flightInfoForm!: FormGroup;
    reservationData!: Reservation;

    flightName: string = '';
    error: string = '';

    pricingMap = new Map<number | undefined, { price: number; currency: string }>();

    selectedSeat: any = null;
    seats: any[] = [];

    allowSeatSelection = false;

    seatOption: 'choose' | 'random' = 'choose';


    reservationId!: number;

    voucherCode: string = '';
    discountPercentage: number = 0;
    originalPrice: number = 0;
    finalPrice: number = this.originalPrice;


    ngOnChanges() {
        this.handleSeatOptionChange();
    }

    onVoucherChanged(voucher: string) {
        this.voucherCode = voucher;
        console.log('Voucher from child:', voucher);
    }

    onFinalPriceChanged(price: number) {
        this.finalPrice = price;
        console.log('Final price from child:', price);
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
        this.reservationData.voucherId = this.voucherCode;
        this.reservationData.seatNumber = this.selectedSeat?.seatNumber ?? '';
        console.log(this.reservationData);

        this.reservationService.createReservation(this.reservationData).subscribe({
            next: (response) => {
                console.log('Reservation successful:', response);
                console.log(response.id + 'iddd');
                   const email = localStorage.getItem('email');
                this.reservationId = response.id;

                Swal.fire('Success', 'Reservation created!', 'success');
                // Call getPrice only if reservationId is valid
                if (this.reservationId != null && !isNaN(this.reservationId)) {
                    this.paymentProcess(this.finalPrice, email, this.reservationId, 'USD');

                    // this.getPrice(this.reservationData.flightScheduleId, this.reservationId);
                } else {
                    console.error('Invalid reservation ID. Price retrieval aborted.');
                }
            },
            error: (error) => {
                console.error('Reservation failed:', error);
                Swal.fire('Error', 'Failed to create reservation', 'error');
            }
        });


    }
    // getPrice(scheduleId: number, reservationId: number) {
    //     console.log(reservationId);
    //     this.pricingService.getPriceByScheduleId(scheduleId).subscribe({
    //         next: (response) => {
    //             const firstPrice = response[0];
    //             if (firstPrice) {
    //                 this.pricingMap.set(scheduleId, {
    //                     price: firstPrice.price,
    //                     currency: firstPrice.currency
    //                 });
    //                 this.originalPrice = firstPrice.price;
    //             }
    //             const email = localStorage.getItem('email');
    //             if (email) {
    //                 this.paymentProcess(firstPrice.price, email, reservationId, 'USD');
    //             } else {
    //                 console.error('Email not found in localStorage');
    //             }
    //         }

    //     });
    // }

    async paymentProcess(amount: number, userEmail: string | null, reservationId: number, currency: string) {
        try {
            console.log("jej")
            console.log(reservationId)
            // Fetch session ID from backend
            const session = await firstValueFrom(this.checkoutService.createCheckoutSession(amount, userEmail, reservationId, currency));

            // Initialize Stripe
            const stripe = await loadStripe('pk_test_51Rlm4d4gTxY9zBy15DRAx7EK6UFNH7O1a1TKRykzW7rqyBngRbiM4IgGxsvnXPtrPYF1kmnoBAIU6PjAFgOlEJU100jUPEAasA');
            if (!stripe) {
                console.error('Stripe failed to initialize');
                return;
            }

            // Redirect to checkout
            const result = await stripe.redirectToCheckout({ sessionId: session.id });

            if (result.error) {
                // Show error to user if redirect fails
                console.error('Stripe redirect error:', result.error.message);
            }
            console.log("jej")

        } catch (err) {
            console.error('Error during payment init:', err);
        }
    }


}



