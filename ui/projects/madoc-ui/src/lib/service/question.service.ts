import { Injectable } from '@angular/core';

import { MadocStore } from './store.service';

import * as ITEM from '../model/item';

import { ActionService } from './action.service';
import { IPageItem } from '../model/iPageItem';
import { Page } from '../model/page';
import { Section } from '../model/item/section/section';
import { Wizard } from '../model/wizard';


@Injectable({
    providedIn: 'root',
  })
export class QuestionService {
  constructor(public actionService: ActionService) {}


  getStore(json) {
    const store = new MadocStore();
    store.build(this.getWizard(json));

    if (json.answers != null) {
      store.setAnswers(json.answers);
    }
    return store;
  }

  private getWizard(json) {
    const wizard = new Wizard();

    wizard.type = json.type;

    const pages = this.getPagesFromJson(json.wizard);

    wizard.pageItems = pages[0].pageItems;
    if (json.wizard.onLoad != null) {
      wizard.onLoadActions = json.wizard.onLoad.map(o =>
        this.actionService.getAction(o)
      );
    }
    return wizard;
  }

  private getPagesFromJson(input: any) {
    const pages: Page[] = [];

    for (let i = 0; i < input.pages.length; i++) {
      const page: Page = new Page(input);
      page.pageItems = this.getPageItemsFromJson(input.pages[i]);
      pages.push(page);
    }
    return pages;
  }

  private getPageItemsFromJson(input: any) {
    const pageItens: IPageItem[] = [];

    for (let i = 0; i < input.elements.length; i++) {
      const item: IPageItem = this.getPageItemFromJson(input.elements[i]);
      pageItens.push(item);
    }

    return pageItens;
  }

  private getPageItemFromJson(obj: any) {
    let item;
    if (this.isSection(obj)) {
      item = new Section();
      item.build(obj);
      item.questions = [];

      for (let i = 0; i < obj.elements.length; i++) {
        item.questions.push(this.buildQuestion(obj.elements[i]));
      }
      this.actionService.build(item, obj);

      return item;
    }
    return this.buildQuestion(obj);
  }

  private isSection(obj: any) {
    return obj.elements != null;
  }

  buildQuestion(json) {
    let item = null;

    if (json.type === 'AutoriaQuestion') {     // Caso para manter legado
      json.type = 'SignatarioQuestion';
    } else if (json.type === 'CustomQuestion') {
      json.type = json.customQuestionType;
    }

    item = new ITEM[json.type]();


    item.build(json);
    this.actionService.build(item, json);

    return item;
  }
}
