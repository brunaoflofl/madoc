import {Question} from '../question';


export class CheckBoxQuestion extends Question {
  selected: boolean;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);

    this.selected = this.getValue(input.selected);
    this._value = this.value == null ? this.selected : this.value;
    this.answer = this.value;
  }

  set value(value) {
    this._value = value;
    this.selected = true;
  }
}
