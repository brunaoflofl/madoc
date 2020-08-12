import {Question} from '../question';


export class IntegerQuestion extends Question {
  public minValue: number;
  public maxValue: number;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);

    this.minValue = input.minValue;
    this.maxValue = input.maxValue;
  }

  public isValid(): boolean {
    if (!this.visible) {
      return true;
    }

    if (this.answer === null || this.answer === '') {
      if (this.required) {
        this.erro.mensagem = 'Campo de preenchimento obrigatório.';
        return false;
      }
      return true;
    }

    if (isNaN(parseFloat(this.answer))) {
      this.erro.mensagem = 'Número informado é inválido';
      return false;
    }

    if (this.answer < this.minValue || this.answer > this.maxValue) {
      this.erro.mensagem = 'Número informado está fora do intervalo permitido: '
          + this.minValue + ' a ' + this.maxValue;
      return false;
    }

    this.erro.mensagem = '';
    return true;
  }
}
