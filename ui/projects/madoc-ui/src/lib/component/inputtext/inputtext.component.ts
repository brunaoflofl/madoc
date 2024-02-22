import { InputTextQuestion } from './../../model/item/inputtext/inputtext-question';
import {Component, Input} from '@angular/core';
import {MadocAbstractComponent} from '../shared/madoc-abstract.component';
import {Question} from '../../model/index';

@Component({
  selector: 'madoc-inputtext',
  template: `
     <div class="component" [ngClass]="{'hidden': !item.visible}"
          [style.border]="isValid()? 'none' : '1px solid red'">
       <madoc-header [item] = item></madoc-header>
       <input [id]="item.id" type="text" [(ngModel)]="value"
              (blur)="onModified()" (keyup.enter)="onModified()" name="{{item.id}}"
              [style.width]="getSize()" style="clear: left"
              class="form-control inputValue" [class.disabled]="isDisabled(item)" [disabled]="isDisabled(item)"
              [style.text-align]="defineAlinhamento()"
              [textMask]="{mask: item.mask}">
       <madoc-error [item] = item></madoc-error>
     </div>
`,
})
export class MadocInputTextComponent extends MadocAbstractComponent<Question> {
  @Input() item: InputTextQuestion;

  getItem() {
    return this.item;
  }

  onModified() {
    this.item.dirty = true;
    super.onChange();
  }


  getSize() {
    return this.item.size != null ? this.item.size + 'em' : '100%';
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }
}
