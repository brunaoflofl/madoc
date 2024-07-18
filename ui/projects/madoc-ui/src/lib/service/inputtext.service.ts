import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InputtextService {

  constructor(private http: HttpClient) { }

  checkUrlValue(url: string, value: string): Observable<HttpResponse<any>> {
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    const fullUrl = `${url}${cleanedValue}`;
    return this.http.get<any>(fullUrl, { observe: 'response' }).pipe(first());
  }
}
