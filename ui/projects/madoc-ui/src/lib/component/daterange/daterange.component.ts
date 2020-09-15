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
            (bsValueChange)="onSelected(i, 0)"
            [bsConfig]="bsConfig"
            />
            Até:
            <input
            type="text"
            class="form-control"
            bsDatepicker
            placement="bottom left"
            style="display: inline-block; width: 180px; margin-left: 10px; margin-right: 10px"
            [(ngModel)]="models[i][1]"
            (bsValueChange)="onSelected(i, 1)"
            [bsConfig]="bsConfig"
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

    bsConfig: Partial<BsDatepickerConfig> = { 
        isAnimated: true, 
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY'
    };

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

    truncate(date: Date) {
        if(!date) {
            return date;
        }
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    onSelected(i, pos) {
        const date = this.truncate(this.models[i][pos]);
        if (date) {
            this.item.dirty = true;
            if (pos === 0) {
                const endDate = this.models[i][1];
                if(!endDate || date > endDate) {
                    this.models[i][1] = date;
                }
            }
            else { // pos === 1
                const startDate = this.models[i][0];
                if(!startDate || date < startDate) {
                    this.models[i][0] = date;
                }
            }
            if (this.isValidPeriod(i)) {
                this.onChange();
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
        this.models
            .filter(m => m[0] && m[1])
            .forEach(m => {
                const a = moment(m[0]).format('DD/MM/YYYY');
                const b = moment(m[1]).format('DD/MM/YYYY');
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
