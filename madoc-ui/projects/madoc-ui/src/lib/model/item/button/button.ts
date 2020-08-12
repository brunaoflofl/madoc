import {Question} from '../question';
import {Action} from '../../actions/action';


export class Button extends Question {
  actions: Action[] = [];
  constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
  }

  isVisible() {
    return this.visible;
  }
}
