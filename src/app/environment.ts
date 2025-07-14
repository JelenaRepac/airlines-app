// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:8000/api/auth',
//     apiUrlPassport: 'http://localhost:8000/passport',

//   reservationUrl: 'http://localhost:9000/api/reservation',
//   countryUrl: 'http://localhost:9090/api/country',
//   airportUrl: 'http://localhost:9090/api/airport',

//   apiUrlFlight: 'http://localhost:9090/api/flight',
//   apiUrlSybscription: 'http://localhost:8081/api/subscription',

//   apiUrlVoucher: 'http://localhost:8001/api/voucher',
//   apiUrlPricing: 'http://localhost:8082/api/price',


//   apiUrlFlightSchedule: 'http://localhost:9090/api/flightSchedule', // Replace with the correct URL in prod
//   accessKey: 'a0c2b52e19dd4518239d16ae667b4c22'
// };
export const environment = {
  production: false,

apiUrl: '/api/auth',
  apiUrlPassport: 'http://localhost:8081/passport',

  reservationUrl: 'http://localhost:8081/api/reservation',
  countryUrl: 'http://localhost:8081/api/country',
  airportUrl: 'http://localhost:8081/api/airport',

  apiUrlFlight: 'http://localhost:8081/api/flight',
  apiUrlSybscription: 'http://localhost:8081/api/subscription',

  apiUrlVoucher: 'http://localhost:8081/api/voucher',
  apiUrlPricing: 'http://localhost:8081/api/price',

  apiUrlFlightSchedule: 'http://localhost:8081/api/flightSchedule',

  accessKey: 'a0c2b52e19dd4518239d16ae667b4c22'
};
