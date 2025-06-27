import { FlightInformationDto } from "./flight.model";

export interface FlightSchedule {
  id: number;
  status: string;
  arrivalDate: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  startAirport: string;
  endAirport: string;
  flightInformation: FlightInformationDto;
}