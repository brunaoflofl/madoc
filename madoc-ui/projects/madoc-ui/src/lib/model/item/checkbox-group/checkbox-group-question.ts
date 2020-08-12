import { MadocStore } from '../../../service/store.service';
import {MultiValueQuestion} from '../shared/multi-value.question';
import {Option} from '../../option';
import {Rule} from '../../rule';
import {Answer} from '../../answer';

export class CheckBoxGroupQuestion extends MultiValueQuestion {

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input, false);
  }
}
