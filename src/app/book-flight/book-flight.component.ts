import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../service/flight.service';
import { AirplaneSeatsComponent } from "../airplane-seats/airplane-seats.component";
import { ScheduleService } from '../service/schedule.service';
import { ScheduleInput } from '../models/schedule-input.model';
import { CommonModule } from "@angular/common";
import { MatStep, MatStepper } from '@angular/material/stepper';
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
import { VoucherService } from '../service/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModules } from '../shared.module';

@Component({
    selector: 'app-book-flight',
    templateUrl: './book-flight.component.html',
    styleUrl: './book-flight.component.css',
    imports: [TicketViewComponent, AirplaneSeatsComponent,
        SharedModules, MatRadioButton, FormsModule, MatRadioGroup],
    standalone: true
})
export class BookFlightComponent implements OnInit {
    flightScheduleId!: number;
    flightInfo: any;
    schedule!: ScheduleInput;
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private reservationService: ReservationService,
        private seatService: SeatsService,
        private checkoutService: CheckoutService,
        private snackBar: MatSnackBar) { }

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

    numberOfPassengers!: number;
    selectedSeats: FlightScheduleSeatInformationOutputDto[] = [];

    seatSelectionLocked = false;

    @ViewChild('scrollTarget') scrollTarget!: ElementRef;


    ngOnChanges() {
        console.log(this.schedule + 'JJEJEJEJE');
        this.handleSeatOptionChange();
        this.refreshSeatSelection();
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

            setTimeout(() => {
                if (this.scrollTarget?.nativeElement) {
                    this.scrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    console.warn('scrollTarget not available');
                }
            }, 200);

        } else {
            this.seats.forEach(seat => seat.selected = false);
            this.selectedSeat = null;
        }
    }


    assignRandomSeat() {
        const availableSeats = this.seats.filter(seat => !seat.bookingStatus);

        if (availableSeats.length < this.numberOfPassengers) {
            this.snackBar.open('Not enough available seats for your selection.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center'
            });
            return;
        }

        this.seats.forEach(seat => seat.selected = false);
        this.selectedSeats = [];

        const shuffled = availableSeats.sort(() => 0.5 - Math.random());
        const randomSelection = shuffled.slice(0, this.numberOfPassengers);

        randomSelection.forEach(seat => {
            seat.selected = true;
            this.selectedSeats.push(seat);
        });

        this.refreshSeatSelection();
        this.seatSelectionLocked = true;

        console.log('Randomly assigned seats:', this.selectedSeats);

        //   setTimeout(() => {
        //         this.nextButton?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     }, 100);
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
        this.numberOfPassengers = +this.route.snapshot.paramMap.get('passengers')!;

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
            next: (schedule: any) => {
                console.log('Fetched schedule:', schedule);
                this.schedule = schedule;

            },
            error: (err) => {
                console.error('Failed to load schedules', err);
            }
        });
    }


    onSeatSelected(seat: FlightScheduleSeatInformationOutputDto) {
        if (this.seatSelectionLocked) {
            console.log('Seat selection is locked after random assignment.');
            return;
        }
        if (this.seatOption === 'choose') {
            const index = this.selectedSeats.findIndex(s => s?.id === seat.id);
            if (index === -1) {
                if (this.selectedSeats.length < this.numberOfPassengers) {
                    this.selectedSeats.push(seat);
                } else {
                    const message = this.numberOfPassengers === 1
                        ? 'You already have selected one seat'
                        : `You already have selected ${this.numberOfPassengers} seats`;

                    this.snackBar.open(message, 'Close', {
                        duration: 3000,
                        verticalPosition: 'bottom',
                        horizontalPosition: 'center'
                    });

                    console.log(message);
                }
            } else {
                this.selectedSeats.splice(index, 1);
            }


            this.refreshSeatSelection();
            console.log('Selected seats:', this.selectedSeats);
        } else {
            console.log('Cannot select manually when seatOption is random');
        }
    }

    refreshSeatSelection() {
        this.seats.forEach(seat => {
            seat.selected = this.selectedSeats.some(selected => selected?.id === seat.id);
        });
    }


    //REZERVACIJA ONOLIKO KOLIKO PUTNIKA -- NA BACK SALJEM LISTU REZERVACIJA !!!!
    reserve() {
        console.log(this.reservationData);
        if (
            !this.selectedSeats || this.selectedSeats.length === 0) {
            console.error('No reservation data or seats selected');
            return;
        }

        const reservationIds: number[] = [];
        const email = localStorage.getItem('email');
        const userIdStr = localStorage.getItem('userId');
        const userId = userIdStr ? +userIdStr : undefined; // <-- change null to undefined

        console.log(userId)


        let completed = 0;

        this.selectedSeats.forEach((seat, index) => {
            const reservationData = { ...this.reservationData }; // clone if needed
            reservationData.flightSchedule = this.schedule;
            reservationData.userId = userId;
            reservationData.seatNumber = seat.seatNumber;
            reservationData.voucherId = this.voucherCode;
            reservationData.reservedAt = new Date().toISOString();
            console.log('RESERVATION' + reservationData)

            this.reservationService.createReservation(reservationData).subscribe({
                next: (response) => {
                    console.log(`Reservation successful for seat ${seat.seatNumber}:`, response);
                    reservationIds.push(response.id);
                    completed++;

                    // Once all requests are complete, call payment
                    if (completed === this.selectedSeats.length) {
                        Swal.fire('Success', 'All reservations created!', 'success');

                        if (reservationIds.length > 0) {
                            console.log(this.finalPrice)
                            this.paymentProcess(this.finalPrice, email, reservationIds, 'USD');
                        } else {
                            console.error('No valid reservation IDs collected.');
                        }
                    }
                },
                error: (error) => {
                    console.error(`Reservation failed for seat ${seat.seatNumber}:`, error);
                    completed++;


                }
            });
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

    async paymentProcess(amount: number, userEmail: string | null, reservationIds: number[], currency: string) {
        try {
            console.log("jej")
            console.log(reservationIds)
            // Fetch session ID from backend
            const session = await firstValueFrom(this.checkoutService.createCheckoutSession(amount, userEmail, reservationIds, currency));

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



