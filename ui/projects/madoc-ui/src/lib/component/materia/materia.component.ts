import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs';

import { Choice } from '../../model/choice';
import { MateriaQuestion } from '../../model/item/materia/materia-question';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { HttpService } from './../../service/http.service';

@Component({
    selector: 'madoc-materia',
    templateUrl: './materia.component.html',
    providers: [HttpService],
    styleUrls: ['./materia.component.css']
})
export class MadocMateriaComponent implements IMadocComponent, OnInit {
    @Input()
    public item: MateriaQuestion;
    @Output()
    retorno$ = new EventEmitter();
    materia;
    erro: string;
    asyncSelected: string;
    typeaheadLoading: boolean;
    typeaheadNoResults: boolean;
    dataSource: Observable<any>;
    materias: any[] = [];

    _validate = false;

    constructor(private httpService: HttpService) {
        this.dataSource = new Observable((observer: any) => {
            if (
                this.asyncSelected == null ||
                this.asyncSelected.match(this.item.regex) == null
            ) {
                this.clean();
            } else {
                this.httpService.getJson(this.item.url, this.asyncSelected).subscribe(
                    (result: any) => {
                        this.materias = result.map(r => r.identificacao);
                        observer.next(result);
                    },
                    err => {
                        this.clean();
                    }
                );
            }
        });

    }

    private clean() {
        this.typeaheadLoading = false;
        this.typeaheadNoResults = true;
    }

    ngOnInit() {
        this.item.$answer.subscribe(
            value =>
                (this.item.answer = this.asyncSelected = Array.isArray(value)
                    ? value[0]
                    : value)
        );
    }

    changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    blur(e): void {
        if (e == null || e.trim() === '') {
            if (this.item.answer != null) {
                this.onChange(null);
            }
        } else if (e.trim() !== this.item.answer) {
            if (
                this.materias != null &&
                this.materias.length > 0 &&
                this.materias.findIndex(
                    item => e.toUpperCase() === item.toUpperCase()
                ) > -1 &&
                e.match(this.item.regex) != null
            ) {
                this.onChange(
                    this.materias.filter(
                        item => e.toUpperCase() === item.toUpperCase()
                    )[0]
                );
            } else {
                this.item.answer = this.asyncSelected = null;
            }
        }
    }

    normalize(materia) { }

    typeaheadOnSelect(e: TypeaheadMatch): void {
        if (this.asyncSelected.match(this.item.regex) != null) {
            this.onChange(e.value);
        } else {
            this.onChange(null);
        }
    }

    onChange(value) {
        this.item.dirty = true;

        this.item.answer = this.asyncSelected = value;

        const escolha = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        this.retorno$.emit(escolha);
    }

    isDisabled(item?) {
        return this.item.enabled !== true;
    }

    validate(event) {
        this.validate = event;
    }

    isOk() {
        if (
            this.asyncSelected != null &&
            this.asyncSelected.length > 4 &&
            this.asyncSelected.match(this.item.regex) == null
        ) {
            this.erro = 'Matéria inválida';
            return false;
        }
        this.erro = '';
        return this.isValid();
    }

    isValid() {
        if (!this._validate && !this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }
}
