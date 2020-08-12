import {Component, Input, OnInit} from '@angular/core';
import {MadocAbstractComponent} from '../shared/madoc-abstract.component';
import {DecimalQuestion, IntegerQuestion} from '../../model';

@Component({
  selector: 'madoc-number',
  template: `
    <div class="component" [ngClass]="{'hidden': !item.visible}"
         [style.border]="isValid() ? 'none' : '1px solid red'">
      <madoc-header [item] = item></madoc-header>
      <input type="text" [(ngModel)]="value" class="form-control inputValue"
             [class.disabled]="isDisabled(item)" [disabled]="isDisabled(item)"
             (blur)="onModified()" (keyup.enter)="onModified()"
             name="item.id" [style.width]="getSize()" [style.text-align]="defineAlinhamento()">
      <madoc-error [item] = item></madoc-error>
    </div>
`,
})
export class MadocNumberComponent extends MadocAbstractComponent<IntegerQuestion> implements OnInit {
  @Input() item: IntegerQuestion;


  getItem() {
    return this.item;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formatValue(this.item.answer);
  }

  onModified() {
    if (this.isModified()) {
      this.item.dirty = true;
      this.formatValue(this.value, false);
      super.onChange();
    }
  }

  getSize() {
    const maxValue = (<IntegerQuestion>this.item).maxValue != null ? '' + (<IntegerQuestion>this.item).maxValue : null;

    if (maxValue != null && maxValue.length >= 7) {
      return maxValue.length + 'em';
    } else if (this.item.size != null) {
      return this.item.size + 'em';
    }
    return '7em';
  }

  formatValue(v, setAnswer = true) {
    if (v != null) {
      this.value = this.item instanceof DecimalQuestion ?
        this.formatDecimal(v) : this.formatInteger(v);
    }
    if (setAnswer) {
      this.item.answer = this.value;
    }
  }

  formatInteger(v) {
    return String(v).replace(/[^\d]/g, '');
  }

  formatDecimal(v) {
    v = String(v).replace(/[^\d\,]/g, '').replace(',', '.');
    if (v === '') {
      return '';
    }
    v = Number(v).toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }

}
