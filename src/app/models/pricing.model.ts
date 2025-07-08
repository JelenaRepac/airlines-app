import { FlightSchedule } from "./flight-schedule.model";

export interface Price {
  id: number;
  price: number;
  currency: string;
  validFrom: Date;
  validTo: Date;
  flightSchedule: FlightSchedule
  
}
