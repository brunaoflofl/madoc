import { Action } from './../../actions/action';
import { MadocStore } from '../../../service/store.service';
import { Rule } from '../../rule';
import { Question } from '../question';
import { IPageItem } from '../../iPageItem';
import { PageItem } from '../page-item';

export class Section extends PageItem implements IPageItem {
  private _attributes: any;
  public questions: Question[] = [];
  private rules: Rule[] = [];
  public onLoadActions: Action[] = [];

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);

    this.pushRule(this.rules, input, 'enabled');
    this.pushRule(this.rules, input, 'visible');
    this.pushRule(this.rules, input, 'display');
  }

  public get attributes() {
    return this._attributes;
  }

  public set attributes(attributes) {
    this._attributes = attributes;
  }

  public getRules() {
    return this.rules;
  }

  public executeRules(store: MadocStore) {
    for (const rule of this.getRules()) {
      rule.execute(this, store);
    }
    for (const question of this.questions) {
      question.executeRules(store);
    }
  }
}
