import {IMadocComponent} from './../shared/madoc-abstract.component';
import {Option} from './../../model/option';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Choice, ComboQuestion} from '../../model';


@Component({
  selector: 'madoc-combo',
  template: `
     <div class="component" [ngClass]="{'hidden': !item.visible}" [id]="item.id"
          [style.border]="item.isValid()? 'none' : '1px solid red'">
       <madoc-header [item]="item"></madoc-header>
       <select class="form-control selectValue" [(ngModel)]="value" (change)="onClick($event)" [disabled]="!item.enabled">
         <option *ngFor="let option of item.attributes" value="{{option.value}}"
                 [selected]= "option.selected" >{{option.display}}
         </option>
       </select>
       <madoc-error [item] = item></madoc-error>
    </div>
`,
})
export class MadocComboComponent implements IMadocComponent, OnInit {
  @Input() item: ComboQuestion;
  @Output() public retorno$ = new EventEmitter();
  value: string;


  getItem() {
    return this.item;
  }

  ngOnInit() {
    const self = this;
    if (this.item._value != null) {
      this.selectOption(this.item._value);
    }
    this.item.$answer
    .subscribe(value => {
      self.item.attributes.forEach(a => a.selected = false);
      self.onChange(this.normalizeValue(value), false);
    });
  }

  onClick(event) {
    this.item.dirty = true;
    this.onChange(event.target.value);
  }

  onChange(value, actions = true) {
    const option = this.selectOption(value);
    const choice = new Choice(this.item.id, this.item.display, this.value, this.item.isValid(), actions);
    this.retorno$.emit(choice);
  }

  isDisabled(option) {
    return option.enabled !== 'true' && option.enabled !== true;
  }

  private selectOption(value) {
    const option: Option = value == null || value === '' ?
        this.item.attributes[0] :
        this.item.attributes.filter(a => a.value.toLowerCase() === value.toLowerCase())[0];

    // O teste abaixo é necessário para o caso do combo ser vazio
    if (option) {
      this.value = option.value;
      this.item.init(option);
    }
    return option;
  }

  private normalizeValue(value) {
    return value ? (Array.isArray(value)) ? value[0] : value : null;
  }
}
