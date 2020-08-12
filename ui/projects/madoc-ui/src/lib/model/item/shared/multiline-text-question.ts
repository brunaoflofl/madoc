import { isEqual } from 'lodash';
import { TextQuestion } from './text-question';


export abstract class MultiLineTextQuestion extends TextQuestion {
  public lines: number;
  public inline: boolean;

  public constructor() {
    super();
  }

  build(input) {
    super.build(input);

    this.lines = input.lines;
    this.inline = input.inline;
  }

  public isValid(): boolean {
    if (!this.visible) {
      return true;
    }

    if (this.required === true && this.isNotPreenchido()) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório';
      return false;
    }


    if (this.required === true && this.defaultValueSatisfiesRequiredQuestion === false
      // tslint:disable-next-line:triple-equals
      && this.isEqualDefaultValue()) {
      this.erro.mensagem = 'O valor sugerido deve ser modificado ' +
        'pelo usuário.';
      return false;
    }


    if (!this.isNotPreenchido() && this.regex) {
      const r = this.answer.match(this.regex) != null;
      if (!r) {
        this.erro.mensagem = 'Texto informado inválido';
      }
      return r;
    }
    this.erro.mensagem = '';
    return true;
  }

  isEqualDefaultValue() {
    return this.answer === this.defaultValue;
  }
}
