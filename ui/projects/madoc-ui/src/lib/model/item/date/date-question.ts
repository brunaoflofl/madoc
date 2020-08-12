import { Question } from '../question';
import { Answer } from '../../answer';
import * as _moment from 'moment';
const moment = _moment;

export class DateQuestion extends Question {
  public today: boolean;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.today = input.today;
    this.answer = [];
    this.answer.push(new Answer('date'));

    if (this.value) {
      this.answer[0].other = this.value;
    } else if (this.today) {
      this.answer[0].other = moment(new Date()).format('DD/MM/YYYY');
    } else if (this.defaultValue) {
      this.answer[0].other = moment(new Date(this.defaultValue)).format(
        'DD/MM/YYYY'
      );
    }
  }

  public isValid(): boolean {
    if (
      this.required === true &&
      (this.answer[0] == null || this.answer[0].other === null)
    ) {
      this.erro.mensagem = 'Campo de preenchimento obrigatório.';
      return false;
    }

    if (
      this.required === true &&
      this.defaultValueSatisfiesRequiredQuestion === false &&
      this.answer[0].other ===
        moment(new Date(this.defaultValue)).format('DD/MM/YYYY')
    ) {
      this.erro.mensagem =
        'O valor sugerido inicialmente deve ser modificado pelo usuário.';
      return false;
    }

    this.erro.mensagem = '';
    return true;
  }
}
