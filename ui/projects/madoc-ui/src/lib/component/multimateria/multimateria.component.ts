import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs';

import { Choice } from '../../model/choice';
import { MultiMateriaQuestion } from '../../model/item/multimateria/multimateria-question';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { HttpService } from './../../service/http.service';
import { Materia } from './materia.model';
import { parseString } from 'xml2js';

@Component({
    selector: 'madoc-multimateria',
    templateUrl: './multimateria.component.html',
    providers: [HttpService],
    styleUrls: ['./multimateria.component.css'],
})
export class MadocMultiMateriaComponent implements IMadocComponent, OnInit {
    @Input()
    public item: MultiMateriaQuestion;
    @Output()
    retorno$ = new EventEmitter();
    // focus = false;
    index = 0;
    materia;
    erro: string;
    materiaText: string[] = [''];
    typeaheadLoading: boolean;
    typeaheadNoResults: boolean;
    dataSource: Observable<any>;
    materias: any[] = [];
    materiasInput: Materia[] = [{ identificacao: '', ementa: '' }];

    // dataSources: Observable[] = []
    constructor(private httpService: HttpService) {
        this.dataSource = new Observable((observer: any) => {
            if (
                this.materiaText[this.index] == null ||
                this.materiaText[this.index].match(this.item.regex) == null
            ) {
                this.clean();
            } else {
                const removeArr = this.materiasInput.map(
                    (el) => el.identificacao
                );
                this.httpService
                    .getJson(this.item.urlMateria, this.materiaText[this.index])
                    .subscribe(
                        (result: any) => {
                            this.materias = result.map((r) => r.identificacao);
                            result = this.materias.filter(
                                (el) => !(removeArr.indexOf(el) !== -1)
                            );
                            observer.next(result);
                        },
                        (err) => {
                            this.clean();
                        }
                    );
            }
        });
        // dataSources.push(dataSource)
    }

    private clean() {
        this.typeaheadLoading = false;
        this.typeaheadNoResults = true;
    }

    ngOnInit() {
        const self = this;
        this.item.$answer.subscribe((value) => {
            if (value) {
                value.map((el, i) => {
                    console.log(el);
                    if (
                        i === 0 &&
                        (this.materiasInput[0].identificacao === '' ||
                            this.materiaText[0] === '')
                    ) {
                        this.materiaText.pop();
                        this.materiasInput.pop();
                    }
                    const val = JSON.parse(el);
                    this.materiaText.push(val.identificacao);
                    this.materiasInput.push(val);
                });
                this.onChange();
            }
        });
    }
    trackByIndex(index: number, obj: any): any {
        return index;
    }
    changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    onBlur(i: number) {
        /* if (
            this.materiaText[i] == null ||
            this.materiaText[i] === ''
        ) {
            this.materiasInput[i] = { identificacao: '', ementa: '' };
            this.onChange();
        } else {
            this.onTypeadBlur(i);
        } */
    }

    onTypeadBlur(i: number) {
        /* const selected = this.findById(this.materiaText[i]);

        if (!selected) {
            const parlamentar = this.materias.filter(p => p.identificacao === this.materiaText[i])[0];
            parlamentar.id = parlamentar.id = parlamentar.cargo = '';
            this.onChange();
        } else {
            this.onSelect(i);
        } */
    }

    findById(id: string) {
        return this.materias.filter(a => a.identificacao === id)[0];
    }

    normalize(materia) { }
    onSelect(i: number) {
        if (this.materiaText[i].match(this.item.regex) != null) {
            this.materiasInput[i].identificacao = this.materiaText[i];
            this.getEmenta(i);
        }
    }
    typeaheadOnSelect(e: TypeaheadMatch, i: number): void {
        if (this.materiaText[i].match(this.item.regex) != null) {
            this.materiasInput[i].identificacao = this.materiaText[i];
            this.getEmenta(i);
        }
    }
    getEmenta(i: number) {
        this.httpService
            .getXml(this.item.urlEmenta, this.materiasInput[i].identificacao)
            .subscribe(
                (result: any) => {
                    if (result != null) {
                        parseString(result, (err, data) => {
                            if (data.ERROR) {
                                console.log(data.ERROR);
                            } else {
                                this.materiasInput[i].ementa =
                                    data.DetalheMateria.Materia[0].DadosBasicosMateria[0].EmentaMateria[0];
                            }
                        });
                    }
                },
                (err) => console.log(err),
                () => {
                    this.onChange();
                }
            );
    }
    onChange() {
        this.item.dirty = true;

        this.updateAnswer();

        const escolha = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        console.log(JSON.stringify(this.item.answer));
        this.retorno$.emit(escolha);
    }

    updateAnswer() {
        this.item.answer = [];
        this.materiasInput.forEach((el) => {
            const json = JSON.stringify(el);
            this.item.answer.push(json);
        });
    }

    isDisabled(item?) {
        return this.item.enabled !== true;
    }

    isOk() {
        if (
            // tslint:disable-next-line:triple-equals
            this.materiasInput != null && this.item.dirty &&
            this.materiasInput.find(
                (e) => e.identificacao.match(this.item.regex) == null
            ) !== undefined
        ) {
            this.erro = 'Uma das matérias é inválida';
            return false;
        }
        this.erro = '';
        return true;
    }
    focus(i: number) {
        this.index = i;
    }
    isValid() {
        if (!this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }
    canAdd() {
        return (
            this.item.maxEntries !== 1 &&
            this.materiasInput[this.materiasInput.length - 1].identificacao !==
            ''
        );
    }
    add() {
        this.materiasInput.push({ identificacao: '', ementa: '' });
        this.materiaText.push('');
        // this.dataSources.push(this.dataSource);
        // this.focus = true;
    }
    canGoUp(i) {
        return !this.isFirst(i) && this.materiasInput.length > 1;
    }
    isFirst(i) {
        return i === 0;
    }

    canGoDown(i) {
        return !this.isLast(i) && this.materiasInput[i].identificacao !== '';
    }
    canDelete() {
        return this.materiasInput.length > 1;
    }

    isLast(i) {
        return i === this.materiasInput.length - 1;
    }
    moveUp(i) {
        this.materiasInput.splice(i - 1, 0, this.materiasInput.splice(i, 1)[0]);
        this.materiaText.splice(i - 1, 0, this.materiaText.splice(i, 1)[0]);
        this.onChange();
    }
    moveDown(i) {
        this.materiasInput.splice(i + 1, 0, this.materiasInput.splice(i, 1)[0]);
        this.materiaText.splice(i + 1, 0, this.materiaText.splice(i, 1)[0]);
        this.onChange();
    }
    delete(i) {
        this.materiasInput.splice(i, 1);
        this.materiaText.splice(i, 1);
        this.onChange();
    }
}
