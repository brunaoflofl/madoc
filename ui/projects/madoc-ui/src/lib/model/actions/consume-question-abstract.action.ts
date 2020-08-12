import {ConsumeAction} from './consume-action';
import {MadocStore} from '../../service/store.service';
import * as x from 'xpath';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export abstract class ConsumeQuestionAbstractAction implements ConsumeAction {
  type;
  target;
  value;
  xpath;

  public constructor(input) {
    this.type = input.type;
    this.target = input.questionId || input.optionId;
    this.value = input.value;
    this.xpath = input.xpath;
  }

  abstract updateQuestionValue(store: MadocStore);

  execute(store, resultado): Observable<boolean> {
    return of(true).pipe(
      map(() => {
        if (this.xpath == null) {
          this.value = resultado;
        } else {
          this.value = this.parse(resultado, this.xpath);

          if (this.value.startsWith('http://')) {
            this.value = this.value.replace('http://', 'https://');
          }
        }
        this.updateQuestionValue(store);
        return true;
      }));
  }

  private parse(result, xpath) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, 'application/xml');
    const questionValue: any = x.select(xpath, doc);

    if (Array.isArray(questionValue)) {
      return questionValue[0] != null ? questionValue[0].data : '';
    } else {
      return questionValue;
    }
  }
}
