import {Collection} from './../../util/collection';
import {filter} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Choice, ChoiceListQuestion} from '../../model';
import {Answer} from '../../model/answer';
import {Option} from '../../model/option';

import {xorWith, union, findIndex, pullAt, isEqual } from 'lodash';

@Component({
  selector: 'madoc-choicelist',
  template: `
  <div class="component container" [ngClass]="{'hidden': !item.visible}" [id]="item.id"
       [style.border]="isValid()? 'none' : '1px solid red'" style="margin-left: 0">
    <madoc-header [item] = item></madoc-header>
    <div class="container pull-left">
      <div class="row">
        <div class="col-md-6" style="margin-bottom: 0.5em; padding-left: 0;">
          <label>Disponíveis</label>
          <select [id]="item.id + '-available'" name="d" multiple="multiple" [(ngModel)]="disponiveisSelecionados"
                  class="form-control selectDisponiveis" size="{{getSize()}}" [disabled]="!item.enabled"
                  (dblclick)="moveRight()">
            <option *ngFor="let option of disponiveis" class="inputLeft"
                    value="{{option['value']}}">{{option['display']}}</option>
          </select>
          <div style="text-align: center; margin-top: 0.5em;">
            <button class="btn btn-sm glyphicon glyphicon-triangle-right"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoRight()" (click)="moveRight()"></button>
            <button class="btn btn-sm glyphicon glyphicon-forward"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoAllRight()" (click)="moveAllRight()"></button>
          </div>
        </div>
        <div class="col-md-6" style="margin-bottom: 0.5em; padding-left: 0;">
          <label>Selecionados</label>
          <select [id]="item.id + '-selected'" name="e" multiple="multiple"
                  [(ngModel)]="escolhidosSelecionados"
                  class="form-control selectSelecionados" size="{{getSize()}}" [disabled]="!item.enabled"
                  (dblclick)="moveLeft()">
            <option *ngFor="let option of item.answer" class="inputRight"
                    value="{{option.value}}">{{option.display}}</option>
          </select>
          <div style="text-align: center; margin-top: 0.5em;">
            <button class="btn btn-default btn-sm glyphicon glyphicon-backward"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoAllLeft()" (click)="moveAllLeft()"></button>
            <button class="btn btn-default btn-sm glyphicon glyphicon-triangle-left"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canGoLeft()" (click)="moveLeft()">
            </button>
            <button class="btn btn-default btn-sm glyphicon glyphicon-triangle-top"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canMoveUp()" (click)="moveUp()">
            </button>
            <button class="btn btn-default btn-sm glyphicon glyphicon-triangle-bottom"
                    style="padding: 0.5em; margin-top: 0.5em; margin-left: 0.5em;"
                    [disabled]="!canMoveDown()" (click)="moveDown()">
            </button>
          </div>
      </div>
      </div>
      <madoc-error [item] = item></madoc-error>
    </div>
  </div>
 `,
})
export class MadocChoiceListComponent implements OnInit {
  @Input() public item: ChoiceListQuestion;
  @Output() public retorno$ = new EventEmitter();
  disponiveis;
  disponiveisSelecionados = [];
  escolhidosSelecionados = [];


  public ngOnInit() {
    const self = this;
    this.inicializaModel();

    this.item.$answer
      .pipe(filter(v => v != null))
      .subscribe(value => {
      if (value) {
        const val = value instanceof Array ? <string[]>value : [value];

        // Preenche a lista de selecionados
        self.item.answer = [];
        val.forEach((v) => {
          const a = this.get(self.item.attributes, v);
          if (a) {
            self.item.answer.push(new Answer(a.value, a.display));
          }
        });

        // Preenche a lista de disponíveis
        this.disponiveis = xorWith(self.disponiveis, self.item.answer, (a, b) => a['value'] === b['value']);
        this.disponiveisSelecionados = [];

        this.onChange(false);
      }
    });
  }

  get(lista: Option[], valor) {
    return lista.find(o => o.value === valor);
  }

  moveRight() {
    this.item.dirty = true;

    this.item.answer = union(this.item.answer,
      this.disponiveis.filter(d => this.disponiveisSelecionados.indexOf(d.value) !== -1));

    this.disponiveis = this.disponiveis.filter(a =>
      this.disponiveisSelecionados.indexOf(a.value) === -1);

    this.escolhidosSelecionados = this.disponiveisSelecionados;
    this.disponiveisSelecionados = [];

    this.onChange();
  }

  moveAllRight() {
    this.item.dirty = true;

    this.item.answer = union(this.item.answer, this.disponiveis);
    this.disponiveis = [];

    this.escolhidosSelecionados = this.disponiveisSelecionados;
    this.disponiveisSelecionados = [];

    this.onChange();
  }

  moveLeft() {
    this.item.dirty = true;

    this.disponiveis = union(this.disponiveis,
      this.item.answer.filter(a => this.escolhidosSelecionados.indexOf(a.value) !== -1));

    this.item.answer = this.item.answer.filter(a =>
      this.escolhidosSelecionados.indexOf(a.value) === -1);

    this.disponiveisSelecionados = this.escolhidosSelecionados;
    this.escolhidosSelecionados = [];

    this.onChange();
  }

  moveAllLeft() {
    this.item.dirty = true;

    this.disponiveis = union(this.disponiveis, this.item.answer);
    this.item.answer = [];

    this.disponiveisSelecionados = this.escolhidosSelecionados;
    this.escolhidosSelecionados = [];

    this.onChange();
  }

  moveUp() {
    this.item.dirty = true;
    const pos = findIndex(this.item.answer, ['value', this.escolhidosSelecionados[0]]);
    const a = this.item.answer[pos];
    pullAt(this.item.answer, pos);
    this.item.answer.splice(pos - 1, 0, a);
  }

  moveDown() {
    this.item.dirty = true;
    const pos = findIndex(this.item.answer, ['value', this.escolhidosSelecionados[0]]);
    const a = this.item.answer[pos];
    pullAt(this.item.answer, pos);
    this.item.answer.splice(pos + 1, 0, a);
  }

  public onChange(actions = true) {
    this.disponiveis.sort(Collection.ordena);
    const choice = new Choice(this.item.id, this.item.display, this.item.answer, this.item.isValid(), actions);

    this.retorno$.emit(choice);
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }

  getSize() {
    return this.item.attributes.length <= 12 ? this.item.attributes.length : 12;
  }

  private inicializaModel() {
    this.item.answer = [];
    this.disponiveis = [];

    this.item.attributes.forEach(a => this.disponiveis.push(new Answer(a.value, a.display)));
  }

  canGoRight() {
    return this.item.enabled && this.disponiveisSelecionados.length > 0;
  }

  canGoAllRight() {
    return this.item.enabled && this.disponiveis.length > 0;
  }

  canGoLeft() {
    return this.item.enabled && this.escolhidosSelecionados.length > 0;
  }

  canGoAllLeft() {
    return this.item.enabled && this.item.answer.length > 0;
  }

  canMoveUp() {
    return this.item.enabled && this.escolhidosSelecionados.length === 1
      && findIndex(this.item.answer, ['value', this.escolhidosSelecionados[0]]) > 0;
  }

  canMoveDown() {
    return this.item.enabled && this.escolhidosSelecionados.length === 1
      && findIndex(this.item.answer, ['value', this.escolhidosSelecionados[0]])
      < this.item.answer.length - 1;
  }
}
