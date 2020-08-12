import {Action} from './actions/action';
import {IPageItem} from './iPageItem';


export class Wizard {
  type: string;
  pageItems: IPageItem[] = [];
  onLoadActions: Action[] = [];
}
