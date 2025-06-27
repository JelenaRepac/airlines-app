import { FlightSchedule } from "./flight-schedule.model";

export interface FlightScheduleSeatInformationOutputDto {
  id: number;
  seatType: string;
  seatNumber: string,
  bookingStatus: boolean;
  flightSchedule: FlightSchedule;
  selected?: boolean;
}