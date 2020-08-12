import {MadocStore} from '../../../service/store.service';
import {ConsumeQuestionAbstractAction} from '../consume-question-abstract.action';

export class ConsumeAddQuestionValueAction extends ConsumeQuestionAbstractAction {

  public constructor(input) {
    super(input);
  }

  updateQuestionValue(store: MadocStore) {
    store.addQuestionValue(this.target, this.value);
  }
}
