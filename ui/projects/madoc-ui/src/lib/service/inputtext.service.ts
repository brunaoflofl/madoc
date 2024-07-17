import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputtextService {

  constructor(private http: HttpClient) { }

  checkSedolNumber(url: string, value: string): Observable<any> {
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    const fullUrl = `${url}${cleanedValue}`;
    console.log("fullUrl", fullUrl); 

    return this.http.get<any>(fullUrl);
  }
}
