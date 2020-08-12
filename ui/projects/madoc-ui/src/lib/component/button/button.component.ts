import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMadocComponent} from '../shared/madoc-abstract.component';
import {Button} from '../../model';

@Component({
  selector: 'madoc-button',
  template: `
  <div class="component" *ngIf="item.visible">
    <input type="button" (click)="onClick()" class="btn btn-primary" value="{{item.display}}"
           [disabled]="isDisabled()" />
    <img src="assets/img/ajax-loader.gif" [ngClass]="{ 'hidden': !active }">
  </div>
   `,
})
export class MadocButtonComponent implements IMadocComponent, OnInit {
  @Input() public item: Button;
  @Output() public retorno$ = new EventEmitter();

  public active;


  ngOnInit() {
    this.item.$status.subscribe((status: boolean) => {
      this.active = status;
    });
  }

  onClick() {
    this.retorno$.emit(this.item.actions);
  }

  isDisabled() {
    return this.item.enabled === false;
  }
}
