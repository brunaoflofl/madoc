import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';

import { Choice } from '../../model/choice';
import { DestaqueVetoQuestion } from '../../model/item/destaqueVeto/destaqueVeto-question';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { HttpService } from '../../service/http.service';
import { FormGroup, FormControl, NgForm } from '@angular/forms';

import { Dispositivo, Veto } from './veto.model';
import { finalize } from 'rxjs/operators';
import { Cedula } from "./cedula.model";

@Component({
    selector: 'madoc-veto',
    templateUrl: './veto.component.html',
    providers: [HttpService],
    styleUrls: ['./veto.component.css']
})
export class MadocVetoComponent implements IMadocComponent, OnInit {
    constructor(private httpService: HttpService) { }

    @Input() public item: DestaqueVetoQuestion;
    @Output() public retorno$ = new EventEmitter();

    tipoDestaqueForm: FormGroup;

    @ViewChild('f', { static: false }) selectVetoForm: NgForm;

    cedula: Cedula;
    veto: Veto;
    vetoNaIntegra = true;
    dataSource: Observable<any>;
    asyncSelected = '';
    vetos: any[] = null;
    answerDispositivos = false;
    canSelect = true;
    vetoAnswer = false;
    vetoNaoExiste = false;
    hasDispositivos = false;

    ngOnInit() {
        this.item.$answer.subscribe(answer => {
            const value = JSON.parse(Array.isArray(answer) ? answer[0] : answer);
            // const value = {
            //   veto: '22/2013',
            //   total: false,
            //   itensSelecionados: [],
            //   texto: []
            // };
            if (value) {
                this.item.answer = value;
            }
        });
        this.getVetos();
        this.initForm();
    }

    hasVetos() {
        return this.vetos != null && this.vetos.length > 0;
    }

    getVetos() {
        if (!this.hasVetos()) {
            this.httpService
                .getJson(this.item.url)
                .pipe(
                    finalize(() => {
                        if (this.hasAnswer()) {
                            if (this.vetoNaoExiste || this.vetoNaoContido()) {
                                this.vetoNaoExiste = true;
                            }
                            if (this.vetoNaoExiste) {
                                Array.isArray(this.vetos)
                                    ? (this.vetos = this.vetos)
                                    : (this.vetos = []);
                                this.vetos.push({
                                    id: this.item.answer.veto,
                                    total: this.item.answer.total,
                                    dispositivos: this.item.answer.itensSelecionados.map(el => ({
                                        numeroIdentificador: el,
                                        texto: null,
                                        conteudo: null,
                                        selected: true
                                    }))
                                });
                            }
                            this.hasDispositivos = this.item.answer.destaqueDispositivos;
                            this.selectVetoForm.form.patchValue({
                                selectVeto: this.item.answer.veto
                            });
                            if (this.hasDispositivos) {
                                this.answerDispositivos = true;
                                this.selecionaOpcaoDestaqueDispositivosVeto();
                                this.selecionaDispostivosPelaAnswer();
                                this.answerDispositivos = false;
                            } else {
                                this.selecionaOpcaoDestaqueVetoNaIntegra();
                            }
                            this.onChange();
                        }
                    })
                )
                .subscribe(
                    (result: Cedula) => {
                        if (result && result.id > 0) {
                            this.vetos = result.vetos
                                .map(v => ({
                                    ...v,
                                    id: v.id,
                                    dispositivos: v.dispositivos.map(el => ({
                                        ...el,
                                        selected: false
                                    }))
                                }))
                                .sort(this.ordenarVeto);
                            this.cedula = result;
                        } else {
                            this.vetoNaoExiste = true;
                        }
                    },
                    err => { }
                );
        }
    }

    hasAnswer() {
        if (Array.isArray(this.item.answer)) {
            return false;
        } else {
            return this.item.answer != null;
        }
    }

    private vetoNaoContido() {
        if (this.vetos && !this.vetoNaoExiste) {
            return !this.vetos.find(el => el.id === this.item.answer.veto);
        }
        return true;
    }
    initForm() {
        this.tipoDestaqueForm = new FormGroup({
            radio: new FormControl({ value: 'destaqueVetoNaIntegra' })
        });

        this.selecionaOpcaoDestaqueVetoNaIntegra();

        (this.tipoDestaqueForm.get('radio') as FormControl).valueChanges.subscribe(
            value => {
                if (value === 'destaqueVetoNaIntegra') {
                    if (!this.answerDispositivos) {
                        this.clearDispositivos();
                        this.onChange();
                    }
                } else if (value === 'destaqueDispositivosVeto') {
                    if (!this.answerDispositivos) {
                        this.onChange();
                    }
                }
            }
        );
    }

    onSelect() {
        this.selectVeto(+this.asyncSelected);
    }

    onChange(respostaNaoNula = true) {
        this.item.dirty = true;
        console.log(this.veto)
        if (respostaNaoNula) {
            const answer = {
                cedula: { id: this.cedula.id, versao: this.cedula.versao },
                veto: {
                    id: this.veto.id,
                    numeroIdentificador: this.veto.numeroIdentificador,
                    numero: this.veto.numero,
                    ano: this.veto.ano
                },
                total: this.veto.total,
                destaqueDispositivos: false,
                itensSelecionados: [],
                texto: []
            };
            const itensSelecionados = [];
            if (!this.veto.total) {
                this.veto.dispositivos.forEach(el => {
                    if (el.selected) {
                        itensSelecionados.push({
                            id: el.id,
                            numeroIdentificador: el.numeroIdentificador
                        });
                    }
                });
                const sortedArray = itensSelecionados.sort(
                    this.ordenarItensSelecionados
                );
                answer.itensSelecionados = sortedArray;
                answer.texto = this.sequential(sortedArray.slice());
            }
            if (!this.vetoNaIntegra) {
                answer.destaqueDispositivos = true;
            }
            this.item.answer = JSON.stringify(answer);
        } else {
            this.item.answer = null;
        }
        const escolha = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        this.retorno$.emit(escolha);
    }

    isDisabled() { }

    isOk() {
        if (!this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }

    selecionaOpcaoDestaqueVetoNaIntegra() {
        if (!this.vetoNaoExiste || !this.hasDispositivos) {
            this.vetoNaIntegra = true;
            this.tipoDestaqueForm.patchValue({ radio: 'destaqueVetoNaIntegra' });
            if (this.vetoNaoExiste) {
                this.tipoDestaqueForm.disable();
            }
        }
    }
    selecionaOpcaoDestaqueDispositivosVeto() {
        if (!this.vetoNaoExiste || this.hasDispositivos) {
            this.vetoNaIntegra = false;
            this.tipoDestaqueForm.patchValue({ radio: 'destaqueDispositivosVeto' });
            if (this.vetoNaoExiste) {
                this.tipoDestaqueForm.disable();
            }
        }
    }

    ordenarVeto(a: Veto, b: Veto) {
        const numeroA = +a.numero;
        const anoA = a.ano;

        const numeroB = +b.numero;
        const anoB = b.ano;

        if (anoA - anoB !== 0) {
            return anoA - anoB;
        } else {
            return numeroA - numeroB;
        }
    }
    ordenarItensSelecionados(a: Dispositivo, b: Dispositivo) {
        const vetorNumeroIdentificadorA = a.numeroIdentificador.split('.');
        const vetorNumeroIdentificadorB = b.numeroIdentificador.split('.');

        return +vetorNumeroIdentificadorA[2] - +vetorNumeroIdentificadorB[2];
    }
    selectVeto(id: number) {
        this.veto = this.vetos.find(val => id === val.id);
        if (this.veto != null) {
            this.habilitaSelecaoDispositivos();
        }
    }

    habilitaSelecaoDispositivos() {
        this.canSelect = !this.veto.total;
    }
    onSelectChange(event: Event) {
        if (event) {
            this.selectVeto(+event);
            if (!this.hasAnswer() || this.vetoAnswer) {
                this.initialState();
                this.onChange();
            } else {
                this.vetoAnswer = true;
            }
        } else {
            this.veto = null;
            this.onChange(false);
        }
    }
    selecionaDispostivosPelaAnswer() {
        this.veto.dispositivos.forEach(el => {
            if (
                this.item.answer.itensSelecionados.indexOf(el.numeroIdentificador) > -1
            ) {
                el.selected = true;
            }
        });
    }

    sequential(vetorItensSelecionados: Dispositivo[]): String[] {
        let index = 0;
        let contadorAglutinacao = 0;
        const itensSelecionados: String[] = [];
        while (vetorItensSelecionados.length > 0) {
            if (index >= 1) {
                const val = +vetorItensSelecionados[index].numeroIdentificador.split('.')[2];
                if (val - 1 === +vetorItensSelecionados[index - 1].numeroIdentificador.split('.')[2]) {
                    if (
                        vetorItensSelecionados[index + 1] &&
                        val + 1 === +vetorItensSelecionados[index + 1].numeroIdentificador.split('.')[2]
                    ) {
                        contadorAglutinacao++;
                        index++;
                        continue;
                    }
                }
                if (contadorAglutinacao > 0) {
                    itensSelecionados.push(
                        (+vetorItensSelecionados[0].numeroIdentificador.split('.')[2]).toString() +
                        ' a ' +
                        (+vetorItensSelecionados[1 + contadorAglutinacao].numeroIdentificador.split('.')[2]).toString()
                    );
                    vetorItensSelecionados.splice(0, 2 + contadorAglutinacao);
                    contadorAglutinacao = 0;
                } else {
                    itensSelecionados.push((+vetorItensSelecionados[0].numeroIdentificador.split('.')[2]).toString());
                    vetorItensSelecionados.splice(0, 1);
                }
                index = 0;
            } else if (vetorItensSelecionados.length === 1) {
                itensSelecionados.push((+vetorItensSelecionados[0].numeroIdentificador.split('.')[2]).toString());
                vetorItensSelecionados.splice(0, 1);
            } else {
                index++;
            }
        }
        return itensSelecionados;
    }

    initialState() {
        this.selecionaOpcaoDestaqueVetoNaIntegra();
        this.clearDispositivos();
    }
    clearDispositivos() {
        this.veto.dispositivos.forEach(el => {
            if (el.selected) {
                el.selected = false;
            }
        });
    }
    vetoParcial(veto) {
        const tipo = veto.total ? 'Total' : 'Parcial';
        return ' (' + tipo + ') ';
    }
}
