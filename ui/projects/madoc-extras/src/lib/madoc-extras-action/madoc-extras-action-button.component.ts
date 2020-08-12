import { MadocExtrasAction } from './madoc-extras-action';
import { Input, Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'madoc-extras-action-button',
  template: `
    <button [id]="action.label" *ngIf="action.visible" type="button" class="btn {{type}} {{size}}" [title]="action.title"
        (click)="action.fire()" [disabled]="!action.enabled">
        <span *ngIf="action.icon" class="glyphicon {{action.icon}}"></span>
        <span [class.hidden-xs]="shrinkable"> {{action.label}}</span>
    </button>
  `,
  styles: ['button {margin-right: 5px;}']
})
export class MadocExtrasActionButtonComponent {

  @Input() action: MadocExtrasAction;

  @Input() type = 'btn-default';

  @Input() size = 'btn-sm';

  @Input() shrinkable = false;

  constructor() { }

}

