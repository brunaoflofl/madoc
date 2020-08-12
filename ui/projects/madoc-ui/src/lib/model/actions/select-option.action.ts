import {MadocStore} from '../../service/store.service';
import {Action} from './action';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export class SelectOptionAction implements Action {
  target;

  public constructor(input) {
    this.target = input.questionId || input.optionId;
  }

  public execute(store: MadocStore): Observable<boolean> {
    return of(true).pipe(
      map(() => {
        store.setOptionSelected(this.target);
        return true;
      }));
  }
}
