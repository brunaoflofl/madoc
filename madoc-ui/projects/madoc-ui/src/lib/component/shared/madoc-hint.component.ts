import {Component, Input} from '@angular/core';
import {Question} from '../../model';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'madoc-hint',
  template: `
 <div style="margin-bottom: 1em; font-size: small"
      [ngClass]="{'hidden': item.hint == null || item.hint == ''}" [innerHTML]="getHint()">
</div>
 `,
})
export class MadocHintComponent {
  @Input() public item: Question;

  constructor(private dss: DomSanitizer) {
  }

  getHint(): SafeHtml {
    return this.dss.bypassSecurityTrustHtml(this.item.hint);
  }
}
