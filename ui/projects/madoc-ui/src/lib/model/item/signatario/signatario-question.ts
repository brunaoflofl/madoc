import { Option } from '../../option';
import { Answer } from '../../answer';
import { Question } from '../question';
import { MadocStore } from '../../../service/store.service';

export class SignatarioQuestion extends Question {
  public attributes: Option[];
  maxEntries = 0;

  public constructor() {
    super();
  }

  build(input: any) {
    this.maxEntries = input.customAttributes && input.customAttributes.length > 0
      && input.customAttributes[0].name === 'maxEntries' ?
      input.customAttributes[0].value : 0;
    super.build(input);

    this.attributes = input.options.map(o => new Option(o));

    this.answer = [];
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

  getMapValue() {
    return this.answer;
  }

  executeRules(store: MadocStore) {
    for (const rule of this.getRules()) {
      rule.execute(this, store);
      if (this.attributes.length > 0) {
        this.attributes.map(a => a.getRules().map(r => r.execute(a, store)));
      }
    }
  }

  findByValue(value) {
    return this.attributes.filter(a => a.value === value)[0];
  }

  findByName(name) {
    return this.attributes.filter(a => a.display === name)[0];
  }

  isValid(): boolean {
    if (this.required === true && (this.answer == null || this.answer[0] == null)) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }

    for (let i = 0; i < this.answer.length; i += 2) {
      if (!this.isValidAuthor(this.answer[i])) {
        return false;
      }
    }

    this.erro.mensagem = '';
    return true;
  }

  private isValidAuthor(value) {
    if (value == null || value === '') {
      this.erro.mensagem = 'É obrigatório informar o autor';
      return false;
    }

    if (this.attributes.filter(a => a.value === value).length === 0) {
      this.erro.mensagem = 'Autor inexistente';
      return false;
    }

    return true;
  }
}
