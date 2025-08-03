import { ScheduleInput } from "./schedule-input.model";

export interface Reservation {
  id?: number;
  // flightScheduleId?: number;
  seatNumber: string;
  userId?: number;
  confirmed: boolean;
  reservedAt: string;
  flightSchedule: ScheduleInput;
  voucherId: string;
}