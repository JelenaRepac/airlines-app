import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { Voucher } from '../models/voucher.model';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private apiUrl = environment.apiUrlVoucher;
  constructor(private http: HttpClient) { }


  getVouchersByUserId(userId: number | undefined): Observable<Voucher[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/user/${userId}`;

    console.log('Calling Voucher API for user ID:', userId);

    return this.http.get<Voucher[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getVoucherByCode(code: string): Observable<Voucher> {

    const url = `${this.apiUrl}/${code}`;


    return this.http.get<Voucher>(url).pipe(
      catchError(this.handleError)
    );
  }

  validateVoucher(code: string): Observable<boolean> {
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? Number(userIdStr) : 0; const params = new HttpParams()
      .set('code', code)
      .set('userId', userId.toString());

    return this.http.post<boolean>(`${this.apiUrl}/validate`, null, { params });
  }



  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid input data. Please check your details.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.statusText}`;
      }
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
