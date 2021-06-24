import { EventEmitter } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';

import { MadocStore } from '../../service/store.service';
import { Action } from '../actions/action';
import { Erro } from '../erro';
import { Rule } from '../rule';
import { PageItem } from './page-item';

export class Question extends PageItem {
  private _answer: any;
  public size: number;
  public hint: string;
  public defaultValue: any;
  onLoadActions: Action[] = [];
  onChangeActions: Action[] = [];
  rules: Rule[] = [];
  public erro: Erro;
  public dirty = false;
  public focus = false;

  private change: BehaviorSubject<string>;
  public $answer;
  public onFocus: EventEmitter<number> = new EventEmitter<number>();


  build(input: any) {
    super.build(input);
    this.erro = new Erro(this.id, this.display);
    this.size = input.size;
    this.hint = input.hint;
    this.defaultValue = input.defaultValue;

    this.initDefaultValues();
    this.initRules(input);
    this.change = new BehaviorSubject(this._answer);
    this.$answer = from(this.change);
  }

  public setFocus(offset: number) {
    this.onFocus.emit(offset);
  }


  public get answer() {
    return this._answer;
  }

  public set answer(answer) {
    this._answer = answer;
  }

  public setQuestionValue(value) {
    this.change.next(value);
  }

  public executeRules(content: MadocStore) {
    for (const rule of this.getRules()) {
      rule.execute(this, content);
    }
  }

  public get value() {
    return this._value;
  }

  public set value(value) {
    this._value = value;
  }

  public getMapValue() {
    if (typeof (this.answer) === 'boolean') {
      return this.answer;
    } else {
      return this.answer != null && this.answer.length > 0 ? this.answer : this.value;
    }
  }

  public getRules() {
    return this.rules;
  }

  public isValid(): boolean {
    if (this.required === true && (this.answer == null || this.answer === '')) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }

    if (this.required === true && this.defaultValueSatisfiesRequiredQuestion === false
      && this.answer === this.defaultValue) {
      this.erro.mensagem =
        'O valor sugerido inicialmente deve ser modificado pelo usuário.';
      return false;
    }

    this.erro.mensagem = '';
    return true;
  }

  private initDefaultValues() {
    if (this.value == null) {
      this._value = this.defaultValue || null;
    }

    this.answer = this._value;

    if (this.display == null) {
      this.display = this._value;
    }
  }

  private initRules(input: any) {
    this.pushRule(this.rules, input, 'enabled');
    this.pushRule(this.rules, input, 'required');
    this.pushRule(this.rules, input, 'visible');
    if (this.isStatement(input.display)) {
      this.rules.push(new Rule('display', input.display || input.value));
    }
    this.pushRule(this.rules, input, 'hint');
  }

  protected isEmptyAnswer() {
    return typeof(this.answer) === 'undefined' || this.answer === null ||
      (Array.isArray(this.answer) && (this._answer.length === 0 || this.answer[0].trim() === '') ||
      (typeof(this.answer) === 'string' && this.answer.trim() === ''));
  }

  protected getCustomAttributeByName(input: any, name: string): {name: string, value: string} {
    if(input?.customAttributes?.length) {
      for(let ca of (input.customAttributes as Array<{name: string, value: string}>)) {
        if(ca.name == name) {
          return ca;
        }
      }
    }
    return null;
  }
}
