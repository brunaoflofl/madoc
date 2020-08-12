import * as _xslt from 'xslt';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { MadocStore } from './../../service/store.service';
import { Observable, of, concat } from 'rxjs';
import { Action } from './action';
import { ConsumeAction } from './consume-action';
import { Transformation } from './transformation';
import { HttpService } from './../../service/http.service';

const xslt = _xslt;

export class ConsumeRestConditionServiceAction implements Action {
    type: string;
    value: string;
    transformations: Transformation[] = [];
    actions: ConsumeAction[] = [];
    materia: any;
    urlMateria: string;
    urlTramitando: string;
    public constructor(private httpService: HttpService) { }

    public build(input: any) {
        this.type = input.type;
        this.value = input.value;
        this.transformations =
            input.transformations != null
                ? input.transformations.map(c => new Transformation(c.type, c.content))
                : null;
    }

    public execute(store: MadocStore): Observable<any> {
        return of(true).pipe(
            delay(500),
            switchMap(() => {
                this.value = store.getQuestion(this.value).getMapValue();
                const materias = this.httpService.getJson(this.urlMateria, this.value).pipe(
                    tap((res: any[]) => {
                        this.materia = res.find(el => this.value === el.identificacao);
                        if (this.materia) {
                            if (
                                this.httpService.getJson(this.urlTramitando,
                                    this.materia.idProcessoIdentificado
                                )
                            ) {
                                return this.httpService.getXml(
                                    'lexeditweb/resources/materia/get?materia=' +
                                    encodeURIComponent(this.value)
                                );
                            }
                        }
                    })
                );
                return null;
            }),
            switchMap(res => {
                const observables = this.actions.map(a => {
                    return a.execute(store, res);
                });
                return concat(...observables);
            })
        );
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
