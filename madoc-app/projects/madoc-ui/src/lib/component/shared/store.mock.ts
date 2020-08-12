import {Action} from './../../model/actions/action';
export class MockContent {
  actions;
  execute(actions: Action[]) {
    this.actions = actions[0];
  }
  get() {
    return this.actions;
  }
}
