import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorPageData, MadocExtrasErrorPageService } from './madoc-extras-error-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'madoc-extras-error-page',
  templateUrl: './madoc-extras-error-page.component.html',
  styleUrls: ['./madoc-extras-error-page.component.css']
})
export class MadocExtrasErrorPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  data: ErrorPageData;

  constructor(
    private route: ActivatedRoute,
    private service: MadocExtrasErrorPageService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.data.subscribe(
      data => {
        this.fillData(data as ErrorPageData);
      }
    ));

    this.subscriptions.push(this.service.data$.subscribe(
      data => {
        this.fillData(data);
      }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  fillData(data: ErrorPageData) {
    if (data) {
      this.data = data;
    }
  }

  back() {
    window.history.back();
  }

  reload() {
    if (window.location.pathname.startsWith('/sac-gabinete')) {
      window.open('/sac-gabinete', '_self');
    } else {
      window.open('/', '_self');
    }
  }

}
