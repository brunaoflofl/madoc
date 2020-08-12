import { MadocStore } from '../../../service/store.service';
import { Action } from '../action';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class AddQuestionValueAction implements Action {
  value;
  target;
  uri;


  public constructor(input) {
    this.value = input.value;
    this.target = input.questionId;
  }

  execute(store: MadocStore): Observable<boolean> {
    return of(true).pipe(
      map(() => {
        store.setQuestionValue(this.target, this.value);
        return true;
      }));
  }
}
