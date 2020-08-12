import { Input } from './input';
import { Rule } from './rule';
import { ISharedProperties } from './iShared-properties';
import * as _moment from 'moment';
const moment = _moment;

export class Option implements ISharedProperties {
  public type: string;
  public id: string;
  public display: string;
  public value: any;
  public optionInput: Input;
  public inputDefaultValue;
  public enabled: boolean;
  public selected: boolean;
  public visible: boolean;

  private _rules: Rule[] = [];

  public constructor(input: any) {
    this.id = input.id;
    this.display = this.getValue(input.display) || this.getValue(input.value);

    this.type = input.type;
    this.value = input.value;
    this.selected = this.getValue(input.selected);
    this.enabled = this.getValue(input.enabled);
    this.visible = this.getValue(input.visible);

    if (input.input) {
      this.optionInput = new Input();
      this.optionInput.type = input.inputType;
      this.optionInput.defaultValue = input.inputDefaultValue;

      switch (this.optionInput.type) {
        case 'DATE':
          this.optionInput.value =
            input.inputDefaultValue || moment(new Date()).format('DD/MM/YYYY');
          break;
        default:
          this.optionInput.value = input.inputDefaultValue;
      }

      this.optionInput.display = this.optionInput.value;

      if (this.optionInput.display === '') {
        this.optionInput.display = this.optionInput.value;
      }
    }
    this.initRules(input);
  }

  getRules() {
    return this._rules;
  }

  private initRules(input: any) {
    if (this.isStatement(input.enabled)) {
      this._rules.push(new Rule('enabled', input.enabled));
    }

    if (this.isStatement(input.visible)) {
      this._rules.push(new Rule('visible', input.visible));
    }

    if (this.isStatement(input.display)) {
      this._rules.push(new Rule('display', input.display || input.value));
    }
  }

  private getValue(value) {
    if (value == null) {
      return null;
    }

    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true' || value === 'false'
      ? value === 'true'
      : this.isStatement(value)
      ? false
      : value.trim();
  }

  private isStatement(texto) {
    return (
      texto != null &&
      typeof texto !== 'undefined' &&
      isNaN(texto) &&
      texto.startsWith('{') &&
      texto.endsWith('}')
    );
  }
}
