import {MultiValueQuestion} from '../shared/multi-value.question';

export class CheckBoxGroupQuestion extends MultiValueQuestion {

  public addSelectAll = false;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input, false);
    if(input.addSelectAll !== undefined) {
      this.addSelectAll = input.addSelectAll;
    }
  }

  public isValid(): boolean {
    if (this.required === true && (!this.answer || this.answer.length === 0)) {
      this.erro.mensagem = 'Selecionar pelo menos uma opção.';
      return false;
    }
    this.erro.mensagem = '';
    return true;
  }
}
