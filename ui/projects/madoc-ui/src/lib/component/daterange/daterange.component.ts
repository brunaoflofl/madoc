import { DaterangeListQuestion } from '../../model/item/daterangeList/daterangeList-question';
import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Choice } from '../../model';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as _moment from 'moment';
const moment = _moment;

@Component({
    selector: 'madoc-date-range',
    template: `
    <div class="component"
    [ngClass]="{ hidden: !item.visible }"
    [style.border]="isValid() ? 'none' : '1px solid red'"
    >
        <madoc-header [item]="item"></madoc-header>
        <div
            *ngFor="let model of models; let i = index"
            [style.border]="isValid() && isValidPeriod(i) ? 'none' : '1px solid red'"
        >
            De:
            <input
            type="text"
            class="form-control"
            bsDatepicker
            placement="bottom left"
            style="display: inline-block; width: 180px; margin-left: 10px; margin-right: 10px"
            [(ngModel)]="models[i][0]"
            (bsValueChange)="onSelected(i, 0, $event)"
            [bsConfig]="{ isAnimated: true, containerClass: 'theme-dark-blue' }"
            />
            Até:
            <input
            type="text"
            class="form-control"
            bsDatepicker
            placement="bottom left"
            style="display: inline-block; width: 180px; margin-left: 10px; margin-right: 10px"
            [(ngModel)]="models[i][1]"
            (bsValueChange)="onSelected(i, 1, $event)"
            [bsConfig]="{ isAnimated: true, containerClass: 'theme-dark-blue' }"
            />
            <button
            id="moveDown"
            class="btn btn-default btn-sm glyphicon glyphicon-triangle-bottom moveDown"
            title="Mover para baixo"
            style="vertical-align: baseline; margin-left: 5px"
            [disabled]="!canGoDown(i)"
            (click)="moveDown(i)"
            ></button>
            <button
            id="moveUp"
            class="btn btn-default btn-sm glyphicon glyphicon-triangle-top moveUp"
            title="Mover para cima"
            style="vertical-align: baseline; margin-left: 5px"
            [disabled]="!canGoUp(i)"
            (click)="moveUp(i)"
            ></button>
            <button
            class="btn btn-default btn-sm glyphicon glyphicon-trash deleteAuthor"
            title="Excluir"
            style="vertical-align: baseline; margin-left: 5px"
            [disabled]="!canDelete()"
            (click)="delete(i)"
            ></button>
        </div>
        <p></p>
        <div>
            <button
            id="addPeriod"
            type="button"
            class="btn btn-primary btn-sm"
            (click)="add()"
            [disabled]="!canAdd()"
            >
            Incluir mais datas
            </button>
        </div>
        <div style="font-size: 0.9em; color: red; clear: left" *ngIf="!isValid()">
            <br/>{{ item.erro }}
        </div>
    </div>
  `
})
export class MadocDaterangeComponent implements OnInit {
    @Input() public item: DaterangeListQuestion;
    @Output() public retorno$ = new EventEmitter();

    bsConfig: Partial<BsDatepickerConfig>;

    models: Date[][] = [];

    constructor(localeService: BsLocaleService) {
        localeService.use('ptbrlocale');
        this.models[0] = [];
    }

    public ngOnInit() {
        moment.locale('ptBr');
        defineLocale('ptbrlocale', ptBrLocale);

        this.item.$answer
            .pipe(filter(d => d != null))
            .subscribe(value => this.initializeModelAndAnswerFromValue(value));
    }

    private initializeModelAndAnswerFromValue(value) {
        this.models = [];
        this.item.answer = [];
        if (value != null && value[0] != null && value[0].length > 0) {
            value.forEach((v: string) => {
                const v1 = moment(
                    v.substring(0, v.indexOf(',')),
                    'DD-MM-YYYY'
                ).toDate();
                const v2 = moment(
                    v.substring(v.indexOf(',') + 1),
                    'DD-MM-YYYY'
                ).toDate();
                this.models.push([v1, v2]);
            });
        }
        this.item.answer = value;
    }

    onSelected(i, pos, event) {
        console.log(event);
        if (event != null) {
            this.item.dirty = true;
            console.log(this.models[i]);
            if (this.models[i].length === 1) {
                this.models[i][pos] = event;
                if (
                    pos === 0 &&
                    (this.models[i][1] == null || this.models[i][1] < this.models[i][0])
                ) {
                    this.models[i][1] = this.models[i][0];
                }
                if (this.isValidPeriod(i)) {
                    this.onChange();
                }
            } else if (this.models[i].length > 1) {
                this.models[i][pos] = event;
                if (this.isValidPeriod(i)) {
                    this.onChange();
                }
            }
        } else {
            if (this.item.dirty) {
                this.models[i][pos] = null;
                this.onChange(this.item.dirty);
            }
        }
    }

    canGoDown(i) {
        return !this.isLast(i) && this.isValid();
    }

    canGoUp(i) {
        return !this.isFirst(i) && this.isValid();
    }

    canDelete() {
        return this.models.length > 1;
    }

    canAdd() {
        return (
            this.item.multipleValues && this.isValidPeriod(this.models.length - 1)
        );
    }

    isFirst(i) {
        return i === 0;
    }

    isLast(i) {
        return i === this.models.length - 1;
    }

    moveDown(i) {
        this.models.splice(i + 1, 0, this.models.splice(i, 1)[0]);
        this.onChange(true);
    }

    moveUp(i) {
        this.models.splice(i - 1, 0, this.models.splice(i, 1)[0]);
        this.onChange(true);
    }

    delete(i) {
        this.models.splice(i, 1);
        this.onChange();
    }

    add() {
        this.models.push([]);
    }

    onChange(actions = true) {
        this.item.dirty = actions;
        this.updateAnswer();
        console.log(this.item.answer);
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
        this.models.forEach(m => {
            const a = m[0] == null ? null : moment(m[0]).format('DD/MM/YYYY');
            const b = m[1] == null ? null : moment(m[1]).format('DD/MM/YYYY');
            this.item.answer.push(a + ',' + b);
        });
    }

    isValid() {
        if (!this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }

    isValidPeriod(i) {
        if (!this.item.dirty) {
            return true;
        }
        return (
            this.models[i][0] != null &&
            this.models[i] !== [] &&
            this.models[i][0] <= this.models[i][1]
        );
    }
}
