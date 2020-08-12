import {MadocStore} from '../../../service/store.service';
import {ConsumeQuestionAbstractAction} from '../consume-question-abstract.action';

export class ConsumeSetQuestionValueAction extends ConsumeQuestionAbstractAction {

  public constructor(input) {
    super(input);
  }

  updateQuestionValue(store: MadocStore) {
    store.setQuestionValue(this.target, this.value);
  }

}
