import {Option} from './../../model/option';
import {filter} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMadocComponent} from '../shared/madoc-abstract.component';
import {CheckBoxGroupQuestion, Choice} from '../../model';
import {pull} from 'lodash';

@Component({
  selector: 'madoc-checkbox-group',
  template: `
  <div class="component" [ngClass]="{'hidden': !item.visible}">
    <madoc-header [item]="item"></madoc-header>
    <madoc-hint [item]="item"></madoc-hint>
    <div class="checkbox">
      <div *ngIf="item.addSelectAll">
        <label [style.font-weight]="'bold'" [style.margin-bottom]="'10px'">
          <input type="checkbox" class="inputChecked" [(ngModel)]="selectAllChecked" (change)="onSelectAll()">
          Marcar todos
        </label>
      </div>
      <div *ngFor="let option of item.attributes">
        <span [ngClass]="{'hidden': !option.visible}">
          <label [style.color]="isDisabled(option) ? 'darkgrey' : 'black'"
               [style.font-weight]="'normal'" [attr.for]="option.id" >
          <input type="checkbox" [id]="option.id" class="inputChecked" [(ngModel)]="option.selected"
                 [disabled]="isDisabled(option)"
                 (click)="onSelected(option.value)">
           {{option.display}}
        </label>
        </span>
      </div>
    </div>
    <madoc-error [item] = item></madoc-error>
  </div>
`,
})
export class MadocCheckBoxGroupComponent implements IMadocComponent, OnInit {
  @Input() public item: CheckBoxGroupQuestion;
  @Output() public retorno$ = new EventEmitter();

  selecionados = [];
  selectAllChecked = false;

  ngOnInit() {
    const self = this;

    this.initSelecionados();

    this.item.$answer
      .pipe(filter(value => value != null && value !== '' &&  typeof(value) !== 'boolean'))
      .subscribe(value => {
        const arrayValue = value instanceof Array ? value : [value];

        self.item.attributes.forEach(a => {
          a.selected = arrayValue.some((obj) => obj.toLowerCase() === a.value.toLowerCase());

          if (a.selected) {
            this.selecionados.push(a.value);
          }
        });

        self.initSelecionados();

        this.onChange(false);
    });
  }

  private initSelecionados() {
    this.selecionados = this.item.attributes.filter(o => o.selected).map(o => o.value);
    this.item.answer = this.selecionados;
  }

  isDisabled(option) {
    return !option.enabled || !this.item.enabled;
  }

  onSelected(value) {
    const option = this.getOption(value);
    option.selected = !option.selected;
    this.initSelecionados();
    this.onChange(true);
  }

  getOption(value): Option {
    return this.item.attributes.filter(a => a.value === value)[0];
  }

  sort() {
    const self = this;

    this.selecionados.sort(function (a, b) {
      const r = self.item.attributes.filter(attr => attr.value === a || attr.value === b)[0];

      if (r.value === a) {
        return -1;
      } else if (r.value === b) {
        return 1;
      }
      return 0;
    });
  }

  onChange(actions = true) {
    this.item.dirty = actions ? true : this.item.dirty;

    this.sort();
    this.selectAllChecked = this.item.attributes.every(option => option.selected);

    const escolha = new Choice(this.item.id, this.item.display, this.item.answer, this.item.isValid());
    this.retorno$.emit(escolha);
  }

  remove(value) {
    const pos = this.selecionados.indexOf(value);
    if (pos > -1) {
      this.selecionados = pull(this.selecionados, value);
    }
  }

  onSelectAll() {
    this.item.attributes.forEach(option => {
      option.selected = this.selectAllChecked;
    });
    this.initSelecionados();
    this.onChange(true);
  }
}
