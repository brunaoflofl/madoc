import { HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MadocExtrasWorkingService {

  private requestCount = 0;

  private disableForNextHttp = false;

  private requestsToIgnore: HttpRequest<any>[] = [];

  private subject = new BehaviorSubject<boolean>(false);

  working$: Observable<boolean> = this.subject.asObservable();

  constructor() { }

  setWorking(working: boolean, httpRequest?: HttpRequest<any>) {

    if (httpRequest) {

      if (working && this.disableForNextHttp) {
        this.requestsToIgnore.push(httpRequest);
        this.disableForNextHttp = false;
        return;
      }

      if (!working) {
        const i = this.requestsToIgnore.indexOf(httpRequest);
        if (i >= 0) {
          this.requestsToIgnore.splice(i, 1);
          return;
        }
      }

    }

    this.requestCount = Math.max(this.requestCount + (working ? 1 : -1), 0);
    this.subject.next(this.requestCount > 0);
  }

  disableForNextHttpRequest() {
    this.disableForNextHttp = true;
  }
}
