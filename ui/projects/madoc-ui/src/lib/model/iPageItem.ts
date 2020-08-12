import {MadocStore} from '../service/store.service';
import {ISharedProperties} from './iShared-properties';


export interface IPageItem extends ISharedProperties {
  executeRules(store: MadocStore);
}
