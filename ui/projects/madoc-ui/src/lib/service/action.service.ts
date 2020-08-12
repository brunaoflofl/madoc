import { ConsumeRestConditionServiceAction } from './../model/actions/consume-rest-condition-service.action';
import { Button } from '../model/item/button/button';
import { Question } from '../model/item/question';
import { Injectable } from '@angular/core';
import * as action from '../model/actions/';
import { HttpService } from './http.service';
import {
  Case,
  ConsumeRestServiceAction,
  OnClick,
  Switch
} from '../model/actions';

@Injectable({
    providedIn: 'root',
  })
export class ActionService {
  constructor(public httpService: HttpService) {}

  getAction(param) {
    return new action[param.type](param);
  }

  build(item: Question, actions) {
    if (actions == null) {
      return;
    }

    if (actions.onLoad) {
      item.onLoadActions = this.buildActions(actions.onLoad, item.id);
    }

    if (actions.onChange) {
      item.onChangeActions = this.buildActions(actions.onChange, item.id);
    }

    if (actions.onClick) {
      const onClickAction = new OnClick();
      onClickAction.actions = this.buildActions(actions.onClick);
      (<Button>item).actions.push(onClickAction);
    }
  }

  buildActions(input, id?: string) {
    const actions = [];

    if (input == null) {
      return actions;
    }
    try {
      input.forEach(o => {
        if (o.type === 'ConsumeRestServiceAction') {
          const restServiceAction = new ConsumeRestServiceAction(
            this.httpService
          );
          restServiceAction.build(o);
          restServiceAction.actions = o.actions.map(a => this.getAction(a));
          actions.push(restServiceAction);
        } else if (o.type === 'ConsumeRestConditionServiceAction') {
          const restServiceAction = new ConsumeRestConditionServiceAction(
            this.httpService
          );
          restServiceAction.build(o);
          restServiceAction.actions = o.actions.map(a => this.getAction(a));
          actions.push(restServiceAction);
        } else if (o.type === 'Switch') {
          actions.push(this.buildSwitchAction(o, id));
        } else {
          const s = this.getAction(o);
          actions.push(s);
        }
      });
      return actions;
    } catch (err) {
      throw new Error(
        `Erro ao carregar ações (${input}) da questão ${input.id}`
      );
    }
  }

  private buildCaseAction(input: any, id: string) {
    const c = new Case();
    c.build(input, id);
    c.actions = input.actions.map(a => this.getAction(a));

    return c;
  }

  private buildSwitchAction(input, id: string) {
    const s = new Switch();
    s.build(input);

    if (input.cases != null) {
      s.cases = input.cases.map(c =>
        this.buildCaseAction(c, c.questionId || c.optionId || id)
      );
    }

    if (input.otherwise != null) {
      s.otherwise = input.otherwise.map(o => this.getAction(o));
    }
    return s;
  }
}
