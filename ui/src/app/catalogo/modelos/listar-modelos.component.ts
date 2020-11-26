import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ModeloListagem } from '../../model/modelo-listagem-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { Casa } from 'src/app/model/casa-dto';
import { normalizeString } from 'src/app/shared/util/string-util';
import * as concat from 'lodash/concat';
import * as valuesIn from 'lodash/valuesIn';
import * as keysIn from 'lodash/keysIn';
import * as cloneDeep from 'lodash/cloneDeep';
import { generos } from 'src/app/model/genero';

@Component({
    selector: 'app-madoc-listar-modelos',
    templateUrl: 'listar-modelos.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListarModelosComponent implements OnInit, OnDestroy {
    @ViewChild('screenTest', { read: ElementRef, static: true })
    screenTest: ElementRef;
    @ViewChild('modelFilterInput', { static: true }) inputFilter: ElementRef;

    tipo: string;
    _modelosOriginais;
    modelos;
    casas: Casa[];
    casaSelected: Casa;

    smallScreen: boolean;

    loading = false;
    filter = '';
    private nFilter: Array<string> = [];

    private activeRow: any = null;

    constructor(
        private dss: DomSanitizer,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params
            .pipe(take(1))
            .subscribe((param) => (this.tipo = param['tipo']));
        this.casas = this.route.snapshot.data.casas;
        this.casaSelected = this.casas[0];
        this._modelosOriginais = this.route.snapshot.data.modelos;
        this.buildModel();
    }

    buildModel() {
        this.modelos = cloneDeep(this._modelosOriginais)
            .filter(
                (f) => f.metadata.CasaLegislativa === this.casaSelected.sigla
            )
            .flatMap((model) => {
                const acc: ModeloListagem[] = [];

                model['metadata'].Categoria.forEach((categoria) => {
                    const m = { ...model };
                    m['categoria'] = categoria;
                    acc.push(m);
                });
                return acc;
            })
            .sort((a, b) =>
                a.categoria !== b.categoria
                    ? this.sortProperty(
                        normalizeString(a.categoria),
                        normalizeString(b.categoria)
                    )
                    : this.sortProperty(
                        normalizeString(a.metadata.Titulo),
                        normalizeString(b.metadata.Titulo)
                    )
            )

            .sort((a, b) => {
                if (a.categoria !== b.categoria) {
                    return this.sortProperty(
                        normalizeString(a.categoria),
                        normalizeString(b.categoria)
                    );
                }
                return this.sortProperty(
                    normalizeString(a.metadata.Titulo),
                    normalizeString(b.metadata.Titulo)
                );
            })
            .map((m) => this.filterModel(m))
            .filter((m) => m != null);
    }

    sortProperty(a: string, b: string) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;
    }

    selectModel(modelo: ModeloListagem) {
        this.router.navigate(['/novo'], {
            queryParams: { tipo: this.tipo, id: modelo.id },
        });
    }

    onSelectedCasa(casa) {
        this.casaSelected = casa;
        this.buildModel();
    }

    montaTituloCasa(sigla: string) {
        const casa = this.getCasa(sigla);
        return `Modelo d${generos[casa.genero].artigoDefinido} ` + casa.nome;
    }

    private getCasa(sigla: string): Casa {
        return this.casas.filter(
            (c) => c.sigla.toUpperCase() === sigla.toUpperCase()
        )[0];
    }

    private filterModel(model: ModeloListagem) {
        if (this.nFilter.length === 0) {
            return model;
        }
        const arr = concat(
            model.id,
            model.metadata.Titulo,
            model.metadata.CasaLegislativa,
            valuesIn(model.metadata.Indexacao),
            keysIn(model.metadata.Fundamentacao),
            valuesIn(model.metadata.Categoria)
        );

        let resp = false;
        arr.forEach((element: string) => {
            this.nFilter.forEach((f) => {
                const text = normalizeString(element);
                if (text.indexOf(f) !== -1) {
                    resp = true;
                }
            });
        });

        if (resp) {
            this.buildHighLightedText(model, 'id');
            this.buildHighLightedText(model, 'casaLegislativa');
            this.buildHighLightedText(model, 'categoria');
            this.buildHighLightedText(model, 'indexacao');
            this.buildHighLightedText(model, 'fundamentacao');
            this.buildHighLightedText(model, 'titulo');
            return model;
        }
        return null;
    }

    onKey() {
        this.nFilter = normalizeString(this.filter)
            .split(/\s+/)
            .filter((s) => s !== '');

        this.buildModel();
    }

    activateRow(m: ModeloListagem) {
        this.activeRow = m;
    }

    isActiveRow(m: ModeloListagem) {
        return this.activeRow === m;
    }

    ngOnDestroy() { }

    getValue(model: ModeloListagem, field: string) {
        switch (field) {
            case 'id':
            case 'categoria':
                return model[field];
            case 'casaLegislativa':
            case 'titulo':
                return model.metadata[
                    this.getStringWithFirsLetterUpperCase(field)
                ];
            case 'fundamentacao':
                return this.trataFundamentacoes(
                    model.metadata.Fundamentacao
                ).join(' ');
            default:
                return valuesIn(
                    model.metadata[this.getStringWithFirsLetterUpperCase(field)]
                ).join(',');
        }
    }

    private getStringWithFirsLetterUpperCase(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    private trataFundamentacoes(fundamentacoes: any) {
        const fRet = ['<ul>'];

        // tslint:disable-next-line:forin
        for (let f in fundamentacoes) {
            const urns: Array<string> = fundamentacoes[f];
            if (urns !== undefined && urns.length > 0) {
                f = f + ' (' + urns.join('; ') + ')';
            }

            fRet.push('<li>' + normalizeString(f) + '</li>');
        }

        fRet.push('</ul>');
        return fRet;
    }

    buildHighLightedText(model: any, field: string) {
        if (this.nFilter.length === 0) {
            return model;
        }
        model['n_' + field] = this.getValue(model, field);

        const text = this.getValue(model, field);

        const nText = normalizeString(model['n_' + field]);

        let i = 0;
        let posicoes: Array<any> = [];

        this.nFilter.forEach((f) => {
            while ((i = nText.indexOf(f, i)) !== -1) {
                posicoes.push({ pos: i, abre: true });
                posicoes.push({ pos: i + f.length, abre: false });
                i += f.length;
            }
        });

        posicoes = posicoes.sort((p1, p2) => p1.pos - p2.pos);

        let ret = '';
        i = 0;
        posicoes.forEach((p) => {
            ret += text.substring(i, p.pos) + (p.abre ? '<mark>' : '</mark>');
            i = p.pos;
        });

        model['n_' + field] = (ret + text.substring(i)).trim();
    }

    highlight(model: any, field: string) {
        const text = this.getValue(model, field);

        if (this.nFilter.length === 0) {
            if (field === 'indexacao') {
                return this.dss.bypassSecurityTrustHtml(text.replaceAll(',', ', '));
            }
            return this.dss.bypassSecurityTrustHtml(text);
        }
        if (field === 'indexacao') {
            return this.dss.bypassSecurityTrustHtml(model['n_' + field].replaceAll(',', ', '));
        }
        return this.dss.bypassSecurityTrustHtml(model['n_' + field]);
    }
}
