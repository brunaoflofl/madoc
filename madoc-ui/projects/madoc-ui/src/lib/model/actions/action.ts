import {MadocStore} from '../../service/store.service';
import {Observable} from 'rxjs';

export interface Action {
  execute(store: MadocStore, value?): Observable<boolean>;
}
