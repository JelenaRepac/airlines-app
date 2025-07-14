import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = environment.apiUrlPassport;

  constructor(private http: HttpClient) { }

  //get oAuth link 
  getOAuthLink(userId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/oauth/link`, {
      params: {
        userId: userId.toString(),
      },
      responseType: 'text'
    });
  }



  uploadFile(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', userId.toString()); // Add the user ID

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }


  openDocument(userId: number, documentName: string ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download`, {
      params: {
        userId: userId.toString(),
        fileName: documentName
      },
      responseType: 'blob'
    });
  }


}
