import {MadocStore} from '../../service/store.service';
import {Action} from './action';

import { Observable, of, concat } from 'rxjs';

export class Case {
  id: string;
  questionValue: string;
  attributeToTest: string;
  actions: Action[] = [];
  executed = false;
  public constructor() { }

  build(input: any, id: string) {
    this.id = input.questionId || input.optionId || id;
    this.questionValue = input.questionValue;
    this.attributeToTest = input.attributeToTest;
  }

  execute(store: MadocStore): Observable<boolean> {
    const self = this;
    const observables = this.actions.map(a => a.execute(store));
    return concat(...observables);
  }


  shouldExecute(store: MadocStore) {
    const question = store.getQuestion(this.id);

    const val = Array.isArray(question.answer) ? question.answer[0].value : question.answer;
    // tslint:disable-next-line:triple-equals
    return val != null && this.questionValue.toString() == val.toString();
  }
}
