import { TextListQuestion } from '../../model/item/textlist/textlist-question';
import { Choice } from '../../model/choice';
import { MadocAbstractComponent } from '../shared/madoc-abstract.component';

import {filter} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {xorWith, isEqual} from 'lodash';

@Component({
  selector: 'madoc-textlist',
  template: `
  <div class="component container" [ngClass]="{'hidden': !item.visible}"
       [style.border]="isValid()? 'none' : '1px solid red'"
       style="width: 100%">
    <madoc-header [item] = item></madoc-header>

    <div class="container pull-left">
      <div class="row" style="margin-bottom: 0.5em;" [ngClass]="{'hidden': !showInput()}">
        <div class="input-group col-xs-12 col-md-12 col-lg-12" style="margin-bottom: 0.5em; padding-left: 0;">
          <input class="form-control inputValue" type="text" [(ngModel)]="value"
                 (keyup.enter)="add()"
                  style="clear: left" [class.disabled]="isDisabled()">
          <span class="input-group-addon" id="basic-addon2" style="padding: 0">
            <button class="btn btn-primary addValue" style="border:none"
                    [disabled]="!canInclude()" (click)="add()">Adicionar
            </button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-12 col-lg-12" style="margin-bottom: 0.5em; padding-left: 0;">
          <select class="textlist" [id]="item.id"
                  multiple="multiple" (change)="select($event.target.options)" [disabled]="isDisabled()"
                  style="width: 100%;" size="7">
            <option class="optionValue" (dblclick)="edit()" *ngFor="let option of item.answer" [disabled]="isDisabled()"
                    value="{{option}}">{{option}}</option>
          </select>
          <div style="text-align: center">
            <button class="btn btn-default btn-sm glyphicon glyphicon-triangle-top moveUp"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoUp()"
                    (click)="moveUp()"></button>

            <button class="btn btn-default btn-sm glyphicon glyphicon-trash"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canDelete()"
                    (click)="remove()"></button>

            <button class="btn btn-default btn-sm glyphicon glyphicon-triangle-bottom moveDown"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoDown()"
                    (click)="moveDown()"></button>
          </div>
        </div>
      </div>
    </div>
    <madoc-error [item] = item></madoc-error>
  </div>
`
})
export class MadocTextListComponent extends MadocAbstractComponent<TextListQuestion>
  implements OnInit {
  @Input() public item;
  @Output() public retorno$ = new EventEmitter();

  private selecionados = [];

  getItem() {
    return this.item;
  }

  ngOnInit() {
    const self = this;
    this.item.$answer
      .pipe(filter(v => v != null))
      .subscribe(value => {
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (!self.isDuplicated(v)) {
              self.value = v;
              self.item.answer.push(v.trim());
            }
          });
        } else {
          self.value = value;
          value === '' ? self.item.answer = [] : self.add(false);
        }

        self.onChange(false);
    });
  }

  onChange(actions = true) {
    const choice = new Choice(
      this.item.id,
      this.item.display,
      this.value,
      this.item.isValid(),
      actions
    );
    this.retorno$.emit(choice);
    this.value = null;
  }

  isDisabled() {
    if (this.item.answer == null) {
      return false;
    }
    return this.item.answer.length >= (<TextListQuestion>this.item).maxLines;
  }

  select(options) {
    this.selecionados = Array.apply(null, options)
      .filter(option => option.selected)
      .map(option => option.value);
  }

  add(dirty = true) {
    this.item.dirty = this.item.dirty === true ? true : dirty;

    if (this.canInclude()) {
      this.item.answer.push(this.value.trim());
      this.onChange(dirty);
    }
  }

  edit() {
    // TODO
  }

  remove() {
    this.item.dirty = true;

    const self = this;
    this.item.answer = xorWith(
      self.item.answer,
      self.selecionados,
      isEqual
    );
    this.selecionados = [];
    this.onChange(true);
  }

  moveUp() {
    this.item.dirty = true;

    const idx = this.item.answer.indexOf(this.selecionados[0]);
    this.item.answer.splice(idx - 1, 0, this.item.answer.splice(idx, 1)[0]);
  }

  moveDown() {
    this.item.dirty = true;

    const idx = this.item.answer.indexOf(this.selecionados[0]);

    this.item.answer.splice(idx + 1, 0, this.item.answer.splice(idx, 1)[0]);
  }

  getSize() {
    return 12;
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }

  canGoUp() {
    return (
      this.item.answer != null &&
      this.selecionados.length === 1 &&
      this.item.answer.length > 0 &&
      this.item.answer.indexOf(this.selecionados[0]) > 0
    );
  }

  canGoDown() {
    return (
      this.item.answer != null &&
      this.selecionados.length === 1 &&
      this.item.answer.length > 0 &&
      this.item.answer.indexOf(this.selecionados[0]) <
        this.item.answer.length - 1
    );
  }

  canInclude() {
    return this.value != null && this.value.trim().length > 0 && this.item.answer.indexOf(this.value.trim()) === -1;
  }

  canDelete() {
    return this.item.answer != null && this.selecionados.length > 0;
  }

  showInput() {
    // tslint:disable-next-line:triple-equals
    return this.item.showInput == true;
  }

  private isDuplicated(value) {
    return this.item.answer.filter(a => a.toLowerCase() === value.toLowerCase()).length > 0;
  }

  private normalizeValue(value) {
    return value ? (Array.isArray(value)) ? value[0] : value : '';
  }
}
