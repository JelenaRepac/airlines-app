import { Flight } from "../fligh/flights/flights.component";
import { FlightInformationDto } from "./flight.model";

export interface ScheduleDto {
  id?: number;
  status: string;
  departureDate: string;      // ISO date string, e.g. "2025-05-01"
  departureTime: string;      // ISO time string, e.g. "14:30:00"
  arrivalDate: string;
  arrivalTime: string;
  startAirport: string;
  endAirport: string;
  flightInformation: FlightInformationDto;
}