import { FlightInformationDto } from "./flight.model";
import { Price } from "./pricing.model";

export interface ScheduleInput {
  id?: number;
  status: string;
  departureDate: string;      // ISO date string, e.g. "2025-05-01"
  departureTime: string;      // ISO time string, e.g. "14:30:00"
  arrivalDate: string;
  arrivalTime: string;
  startAirport: string;
  endAirport: string;
  flightInformation: FlightInformationDto;
  flightPrices:Price[];
}