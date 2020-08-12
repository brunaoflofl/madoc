import {Case} from './case';
import {MadocStore} from '../../service/store.service';
import {Action} from './action';
import {Observable, of, concat} from 'rxjs';

export class Switch implements Action {
  id: string;
  cases: Case[] = [];
  otherwise: Action[] = [];
  executeOtherwise = true;

  constructor() {}

  build(input: any) {
    this.id = input.question || input.option || input.id;
  }

  execute(store: MadocStore): Observable<boolean> {
    const self = this;

    const casesToBeExecuted = this.cases.filter(c => c.shouldExecute(store));

    const observables = casesToBeExecuted.length > 0
      ? casesToBeExecuted.map(c => c.execute(store))
      : self.otherwise.map(a => a.execute(store));

    return concat(...observables);
  }
}
