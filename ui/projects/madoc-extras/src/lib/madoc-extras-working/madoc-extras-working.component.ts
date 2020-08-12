import { MadocExtrasWorkingService } from './madoc-extras-working.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'madoc-extras-working',
  template: `

<div class="darkClass" *ngIf="workingService.working$ | async"></div>

  `,
  styleUrls: ['./madoc-extras-working.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MadocExtrasWorkingComponent implements OnInit {

  public constructor(public workingService: MadocExtrasWorkingService) { }

  ngOnInit() {
  }

}
