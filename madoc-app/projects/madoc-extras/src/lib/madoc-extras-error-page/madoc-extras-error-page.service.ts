import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface ErrorPageData {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MadocExtrasErrorPageService {

  private data = new BehaviorSubject<ErrorPageData>(undefined);
  data$ = this.data.asObservable();

  constructor(
    private router: Router
  ) { }

  showErrorPage(message: string) {
    this.data.next({ message });
    this.router.navigate(['erro']);
  }
}
