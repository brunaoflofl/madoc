import {MadocStore} from '../../service/store.service';
import {Action} from './action';
import {concat, Observable, of} from 'rxjs';


export class OnClick implements Action {
  actions: Action[] = [];


  public constructor() { }

  public execute(store: MadocStore): Observable<boolean> {
    const observables = this.actions.map(a => a.execute(store));

    concat(...observables).subscribe();

    return of(true);
  }
}
