import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';

import { Choice } from '../../model/choice';
import { ConvidadoQuestion } from '../../model/item/convidado/convidado-question';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { condicoes, tratamentos } from './../../model/field';

@Component({
    selector: 'madoc-convidado',
    templateUrl: './convidado.component.html',
    styleUrls: ['./convidado.component.css'],
})
export class MadocConvidadoComponent
    implements IMadocComponent, OnInit, AfterViewInit {
    @Input()
    public item: ConvidadoQuestion;
    @Output()
    retorno$ = new EventEmitter();

    @ViewChild('scrollMe', { static: true })
    myScrollContainer: ElementRef;

    convidados;

    condicoesConvocacao = condicoes;
    tratamentosConvidado = tratamentos;

    constructor() {}

    ngAfterViewInit(): void {
        const self = this;
        this.item.onFocus.subscribe(offset => {
            this.item.dirty = true;
            self.myScrollContainer.nativeElement.scrollIntoView({block: 'center', behaviour: 'smooth'});
          });
    }

    ngOnInit() {
        this.item.dirty = false;

        this.initConvidados();

        this.item.$answer
            .pipe(filter((value) => value != null))
            .subscribe((value) => {
                this.updateFrom(value);
            });
    }

    onClick(event) {
        this.onChange();
    }

    isDisabled() {
        return true;
    }

    initConvidados() {
        this.convidados = [];
        for(let i = 0; i < this.item.minEntries; i++) {
            this.convidados.push(
                {
                    representante: false,
                    tratamento: '',
                    nome: '',
                    cargo: '',
                    representanteDe: '',
                    condicao: 'não informado',
                    touched: false,
                }
            );
        }
    }

    isCampoValido(i, campo) {
        if (this.convidados[i] == null) {
            return false;
        }
        if (
            !this.item.dirty ||
            !this.convidados[i].touched ||
            this.item.isValidFieldValue(campo, this.convidados[i])
        ) {
            return true;
        }
        return false;
    }

    onConvidadoModified(i) {
        this.onModified(i);
    }

    onRepresentanteModifiend(i) {
        this.onModified(i);
    }

    private onModified(i) {
        this.item.dirty = true;
        this.convidados[i].touched = true;
        this.onChange();
    }

    add() {
        this.convidados.push({
            tratamento: '',
            nome: '',
            cargo: '',
            representanteDe: '',
            condicao: 'não informado',
            touched: false,
        });
    }

    delete(i) {
        this.convidados.splice(i, 1);
        this.onChange();
    }

    moveUp(i) {
        this.convidados.splice(i - 1, 0, this.convidados.splice(i, 1)[0]);
        this.onChange(true);
    }

    moveDown(i) {
        this.convidados.splice(i + 1, 0, this.convidados.splice(i, 1)[0]);
        this.onChange(true);
    }

    canAdd() {
        return (
            (this.item.maxEntries === 0 ||
                this.convidados.length < this.item.maxEntries) &&
            this.convidados.filter(
                (p) =>
                    p.representanteDe === '' &&
                    p.tratamento === '' &&
                    (p.nome === '' || p.cargo === '')
            ).length === 0 &&
            this.item.isValid()
        );
    }

    canGoUp(i) {
        return !this.isFirst(i) && this.convidados.length > 1;
    }

    canGoDown(i) {
        return !this.isLast(i);
    }

    canDelete(i) {
        return this.convidados.length > this.item.minEntries;
    }

    isFirst(i) {
        return i === 0;
    }

    isLast(i) {
        return i === this.convidados.length - 1;
    }

    onSelectTipo(i, event) {
        this.convidados[i].tratamento = '';
        this.convidados[i].nome = '';
        this.convidados[i].cargo = '';
        this.convidados[i].representanteDe = '';
        this.convidados[i].touched = false;
        this.convidados[i].representante = event.target.value === 'true';
    }

    onChange(actions = true) {
        this.item.dirty = true;

        this.updateAnswer();

        const escolha = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        this.retorno$.emit(escolha);
    }

    updateAnswer() {
        this.item.answer = [];

        const f = this.item.fields.filter((c) => c.visible === false);

        this.convidados.forEach((c) => {
            const json = JSON.stringify(c);

            if (f != null && f.length > 0) {
                delete json[f[0].name];
            }
            delete json['touched'];
            this.item.answer.push(json);
        });
    }

    updateFrom(value) {
        if (value.length > 0) {
            this.item.dirty = true;
            this.convidados = [];

            if (typeof value === 'string') {
                this.convidados.push(JSON.parse(value));
            } else {
                value.forEach((v) => this.convidados.push(JSON.parse(v)));
            }
        } else {
            this.initConvidados();
        }
        this.updateAnswer();
    }

    isFieldAttribute(field, attribute, convidado?) {
        if (
            this.item != null &&
            this.item.fields != null &&
            this.item.fields.filter((obj) => obj.name === field)[0] != null
        ) {
            if (
                this.item.fields.filter((obj) => obj.name === field)[0][
                    attribute
                ] === true
            ) {
                switch (field) {
                    case 'representanteDe':
                        this.convidados.forEach(
                            (el) => (el.condicao = 'não informado')
                        );
                        break;
                    case 'condicao':
                        this.convidados.forEach(
                            (el) => (el.representanteDe = '')
                        );
                        break;
                }
                switch (attribute) {
                    case 'enabled':
                        return !convidado.representante;
                }
                return true;
            } else {
                return false;
            }
        }
    }

    isValid() {
        if (!this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }
}
