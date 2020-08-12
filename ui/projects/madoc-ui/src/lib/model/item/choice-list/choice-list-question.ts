import { MultiValueQuestion } from './../shared/multi-value.question';
import { MadocStore } from '../../../service/store.service';
import {Option} from '../../option';
import {Rule} from '../../rule';
import {Answer} from '../../answer';

export class ChoiceListQuestion extends MultiValueQuestion {
  public attributes: Option[];

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
  }

  public isValid(): boolean {
    if (this.required === true && (this.answer[0] == null || this.answer[0].value === '')) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }

    this.erro.mensagem = '';
    return true;
  }
}
