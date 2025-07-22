import { FlightSchedule } from "./flight-schedule.model";

export interface Reservation {
  id: number;
  flightScheduleId: number;
  seatNumber: string;
  userId: number;
  confirmed: boolean;
  reservedAt: string;
  flightSchedule?: FlightSchedule;
  voucherId: string;
}