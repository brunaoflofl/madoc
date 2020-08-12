import {ISharedProperties} from './iShared-properties';
import {Input} from './input';
import {Subject} from 'rxjs';


export class SharedProperties implements ISharedProperties {
  public id: string;
  public display: string;
  public type: string;
  public _value: any;
  public selected: boolean;
  public optionInput: Input;
  public defaultValueSatisfiesRequiredQuestion: boolean;

  public enabled: boolean;
  public required: boolean;
  public visible: boolean;

  public $status: Subject<boolean> = new Subject<boolean>();
  private _active = false;

  public constructor(input: any) {
    this.id = input.id;
    this.display = input.display;
    this.type = input.type;
    this._value = input.value;
    this.selected = this.getValue(input.selected);
    this.defaultValueSatisfiesRequiredQuestion = input.defaultValueSatisfiesRequiredQuestion;

    if (input.input) {
      this.optionInput = new Input();
      this.optionInput.type = input.inputType;
      this.optionInput.defaultValue = input.inputDefaultValue;
      this.optionInput.value = input.inputDefaultValue;

      if (this.optionInput.display === '') {
        this.optionInput.display = this.optionInput.value;
      }
    }

    this.enabled = this.getValue(input.enabled);
    this.required = this.getValue(input.required);
    this.visible = this.getValue(input.visible);

    if (this.display == null) {
      this.display = this._value;
    }
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(v: boolean) {
    this._active = v;
    this.$status.next(v);
  }

  public get value() {
    return this._value;
  }

  public set value(value) {
    this._value = value;
  }

  private getValue(value) {
    if (value == null) {
      return null;
    }

    if (typeof value === 'boolean') {
      return value;
    }
    return (value === 'true' || value === 'false' ? value === 'true' :
        this.isStatement(value) ? false : value.trim());
  }

  isStatement(texto) {
    return texto != null && typeof texto !== 'undefined' && isNaN(texto) && texto.startsWith('{') && texto.endsWith('}');
  }
}
