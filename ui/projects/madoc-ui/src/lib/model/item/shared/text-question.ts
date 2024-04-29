import {Question} from '../question';


export abstract class TextQuestion extends Question {
  public minLength: number;
  public maxLength: number;
  public defaultValueSatisfiesRequiredQuestion: boolean;
  public regex: RegExp;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);

    this.minLength = input.minLength;
    this.maxLength = input.maxLength;
    this.defaultValueSatisfiesRequiredQuestion = input.defaultValueSatisfiesRequiredQuestion;

    this.regex = input.regex ? new RegExp(input.regex) : null;

    if (this.value) {
      this.answer = this.value;
    } else if (this.defaultValue) {
      this.answer = this.defaultValue;
    }
  }

  public isValid(): boolean {
    this.erro.mensagem = '';
    
    if (this.required === true && this.isNotPreenchido()) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório';
      return false;
    }

    if (!this.isNotPreenchido() && this.regex) {
      const r = this.answer.match(this.regex) != null;
      if (!r) {
        this.erro.mensagem = 'Texto informado inválido';
        return false;
      }
    }

    if (this.required === true && this.defaultValueSatisfiesRequiredQuestion === false
        && this.answer === this.defaultValue) {
      this.erro.mensagem =
          'O valor sugerido deve ser modificado pelo usuário.';
      return false;
    }

    return true;
  }

  isNotPreenchido() {
    return this.answer == null || this.answer.trim() === '';
  }
}
