import * as _xslt from 'xslt';
import { HttpService } from '../../service/http.service';
import { MadocStore } from '../../service/store.service';
import { Action } from './action';
import { ConsumeAction } from './consume-action';
import { Transformation } from './transformation';
import { concat, Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
const xslt = _xslt;

export class ConsumeRestServiceAction implements Action {
  type: string;
  uri: string;
  transformations: Transformation[] = [];
  actions: ConsumeAction[] = [];

  public constructor(private httpService: HttpService) {}

  public build(input: any) {
    this.type = input.type;
    this.uri = input.uri;

    this.transformations =
      input.transformations != null
        ? input.transformations.map(c => new Transformation(c.type, c.content))
        : null;
  }

  public execute(store: MadocStore): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      switchMap(() => {
        const url = this.getUrl(store);
        return this.httpService.getXml(url).pipe(
          map(response => {
            let resultado = null;

            this.transformations.forEach(t => {
              resultado =
                t.content == null
                  ? null
                  : xslt(response, t.content, this.getOptions());
            });
            if (resultado == null) {
              resultado = response;
            }
            return resultado;
          })
        );
      }),
      switchMap(res => {
        const observables = this.actions.map(a => {
          return a.execute(store, res);
        });
        return concat(...observables);
      })
    );
  }

  private getUrl(store: MadocStore) {
    let u = this.uri.substring(this.uri.indexOf('http'));

    u = u.replace('http', 'https').replace('nocache:', '');

    const params = this.uri.match(/\{[a-z-]*[1-9]?\}/gi);

    if (params) {
      params.forEach(e => {
        const termo = e.replace(/[{}]/g, '');

        u = u.replace(e, store.getQuestion(termo).getMapValue());
      });
    }
    return u;
  }

  private getOptions() {
    return {
      fullDocument: false, // Is the output a complete document, or a fragment?
      cleanup: true, // false will disable all of the below options
      xmlHeaderInOutput: true,
      normalizeHeader: true,
      encoding: 'UTF-8',
      preserveEncoding: false, // When false, always uses the above encoding. When true, keeps whatever the doc says
      collapseEmptyElements: true, // Forces output of self-closing tags
      removeDupNamespace: true,
      removeDupAttrs: true,
      removeNullNamespace: true,
      removeAllNamespaces: false,
      removeNamespacedNamespace: true
    };
  }
}
