import {Component, Input} from '@angular/core';

@Component({
  selector: 'madoc-loading',
  template: `
    <div style="margin-top: 2em;">
      <img src="assets/img/ajax-loader.gif"/>
      <span *ngIf="showText" style="margin-left: 1em;"> Por favor, aguarde...</span>
    </div>
    `
})
export class MadocLoadingComponent {

  @Input() showText = true;

  public constructor() { }

}
