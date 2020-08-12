import {MadocStore} from '../../service/store.service';
import {Action} from '../../model/actions/action';


export interface ConsumeAction extends Action {
  value: any;
  updateQuestionValue(store: MadocStore);
}
