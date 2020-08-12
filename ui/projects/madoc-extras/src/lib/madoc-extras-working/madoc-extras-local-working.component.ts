import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'madoc-extras-local-working',
  templateUrl: './madoc-extras-local-working.component.html',
  styleUrls: ['./madoc-extras-local-working.component.scss'],
})
export class MadocExtrasLocalWorkingComponent implements OnInit {

  @Input()
  working = false;

  constructor() { }

  ngOnInit() { }

}
