import { Question } from '../question';
import { Option } from '../../option';
import { MadocStore } from '../../../service/store.service';
import { Answer } from '../../answer';

export class MultiValueQuestion extends Question {
  public attributes: Option[];

  public constructor() {
    super();
  }

  build(input: any, chooseFirstIfNoneSelected = true) {
    super.build(input);

    this.attributes = input.options.map(o => new Option(o));

    const selecionado = this.attributes.filter(a => a.selected === true);

    if (chooseFirstIfNoneSelected) {
      const s: Option = selecionado.length > 0 ? selecionado[0] : this.attributes[0];

      if (s != null) {
        s.selected = true;
        this.init(s);
      }
    }
  }

  init(option) {
    if (option == null) {
      return;
    }
    this._value = option.value;
    option.selected = true;

    this.answer = [];
    this.answer.push(new Answer(option.value, option.display));
    if (option.optionInput != null) {
      this.answer[0].other = option.optionInput.value;
    }
  }

  set value(value) {
    const self = this;
    if (this.attributes != null) {
      this.attributes.forEach(a => {
        if (a != null) {
          if (a.value === value) {
            self.value = value;
            a.selected = true;
          } else {
            a.selected = false;
          }
        }
      });
    }
  }

  setSelected(id: string) {
    const who = this.attributes.filter(option => option.id === id ? option.selected = true : option.selected = false);
    this.setQuestionValue(who[0].value);
  }

  executeRules(store: MadocStore) {
    for (const rule of this.getRules()) {
      rule.execute(this, store);
    }
    if (this.attributes.length > 0) {
      this.attributes.map(a => a.getRules().map(r => r.execute(a, store)));
    }
  }

  getMapValue() {
    const val = super.getMapValue();

    if (val != null) {
      return val != null && val.length > 0 ? val[0].value : val;
    } else {
      const v = this.attributes.filter(a => a.selected === true);
      return (v != null && v.length > 0) ? v[0].value : this.id;
    }
  }

  public isValid(): boolean {
    if (this.required === true && (this.answer == null || this.answer === '')) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }

    if (this.required === true && this.defaultValueSatisfiesRequiredQuestion === false &&
        this.answer === this.defaultValue) {
      this.erro.mensagem =
          'O valor sugerido inicialmente deve ser modificado pelo usuário.';
      return false;
    }

    this.erro.mensagem = '';
    return true;
  }
}
