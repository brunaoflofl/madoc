import {Component, Input, OnInit} from '@angular/core';
import {IMadocComponent, MadocAbstractComponent} from '../shared/madoc-abstract.component';
import {CheckBoxQuestion} from '../../model';
import {filter} from 'rxjs/internal/operators/filter';


@Component({
  selector: 'madoc-checkbox',
  template: `
  <div class="component" [ngClass]="{'hidden': !item.visible}">
    <div class="checkbox">
      <label  [attr.for]="item.id"
              [ngStyle]="{'color': this.isDisabled(this.item) ? 'darkgrey' : 'black', 'font-weight': 'normal'}">
        <input  [id]="item.id"
                type="checkbox"
                [disabled]="isDisabled(item)"
                [ngModel]="item.selected"
                (change)="onSelected($event.target.checked)">
          {{item.display}}
      </label>
    </div>
      <madoc-hint   [item] = item></madoc-hint>
      <madoc-error  [item] = item></madoc-error>
  </div>
`,
})
export class MadocCheckboxComponent extends MadocAbstractComponent<CheckBoxQuestion> implements IMadocComponent, OnInit {
  @Input() item: CheckBoxQuestion;


  getItem() {
    return this.item;
  }

  ngOnInit() {
    this.item.answer = this.item.selected;
    this.value = this.item.answer;

    this.item.$answer
      .pipe(filter(value => value != null && value !== ''))
      .subscribe(value => this.onSelected(this.normalizeValue(value), false));
  }

  onSelected(value, actions = true) {
    this.item.dirty = true;

    this.value = value;
    this.item.selected = this.normalizeValue(value);
    this.onChange(actions);
  }

  normalizeValue(value) {
    return value ? (Array.isArray(value)) ? this.convertToBooleanIfNecessary(value[0]) : this.convertToBooleanIfNecessary(value) : false;
  }

  private convertToBooleanIfNecessary(value) {
    return (value === 'true' || value === true);
  }
}
