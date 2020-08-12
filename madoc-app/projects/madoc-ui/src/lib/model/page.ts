import {SharedProperties} from './shared-properties';
import {IPageItem} from './iPageItem';


export class Page extends SharedProperties {
  private _pageItems: IPageItem[];


  public constructor(input: any) {
    super(input);
  }

  public get pageItems() {
    return this._pageItems;

  }

  public set pageItems(items: IPageItem[]) {
    if (this._pageItems == null) {
      this._pageItems = [];
    }
    this._pageItems = items;
  }
}
