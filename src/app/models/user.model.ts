export interface User {
  id: number; // optional if you get it from backend only
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  rank: string;
  username?: string;
  passportNumber?: string;
  country?: string;
  phoneNumber?: string;
  birthday?: string;
  passportId?: string;
}
