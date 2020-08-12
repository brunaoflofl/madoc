import {Question} from '../question';


export class TextListQuestion extends Question {
  minLines: number;
  maxLines: number;
  showInput: boolean;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.minLines = input.minLines;
    this.maxLines = input.maxLines;
    this.showInput = input.showInput;
    this.answer = this.value == null ? [] : this.value;
  }

  addQuestionValue(value) {
    super.setQuestionValue(value);
  }

  isValid(): boolean {
    this.erro.mensagem = '';
    const retorno = true;

    if (this.required === true &&
        (this.answer == null || (<Array<String>>this.answer).length === 0)) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }
    return retorno;
  }

}
