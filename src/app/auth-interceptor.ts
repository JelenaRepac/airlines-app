import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);

  const accessToken = localStorage.getItem('authToken');

  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) return throwError(() => error);

        const body = { refreshToken: `Bearer ${refreshToken}` };

        return http.post<any>('http://localhost:8000/api/auth/token', body).pipe(
          switchMap((response) => {
            const newAccessToken = response.accessToken;

            if (!newAccessToken) return throwError(() => error);

            localStorage.setItem('authToken', newAccessToken);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });

            return next(retryReq);
          }),
          catchError((refreshError) => throwError(() => refreshError))
        );
      }

      return throwError(() => error);
    })
  );
};
