import {MadocStore} from '../../../service/store.service';
import {Action} from '../action';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export class SetQuestionValueAction implements Action {
    value;
    target;

    constructor(input) {
        this.target = input.questionId || input.optionId;
        this.value = input.value;
    }

    execute(store: MadocStore): Observable<boolean> {
      return of(true).pipe(
        map(() => {
          store.setQuestionValue(this.target, this.value);
          return true;
        }));
    }
}
