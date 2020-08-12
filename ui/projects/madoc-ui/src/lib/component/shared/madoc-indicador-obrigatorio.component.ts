import {Component, Input} from '@angular/core';
import {Question} from '../../model';

@Component({
  selector: 'madoc-indicador-obrigatorio',
  template: `
 <span title="Obrigatório" [style.color]="'red'" *ngIf="item.required"> * </span>
 `,
})
export class MadocIndicadorObrigatorioComponent {
  @Input() public item: Question;
}
