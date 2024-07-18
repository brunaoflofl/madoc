import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InputtextService {

  constructor(private http: HttpClient) { }

  checkUrlValue(url: string, value: string): Observable<any> {
    const fullUrl = `${url}${encodeURIComponent(value)}`;
    return this.http.get<any>(fullUrl, { observe: 'response' }).pipe(first());
  }
}
