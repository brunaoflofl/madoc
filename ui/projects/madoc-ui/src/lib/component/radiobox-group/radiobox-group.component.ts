import { Option } from './../../model/option';
import { filter } from 'rxjs/internal/operators/filter';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { Choice, RadioBoxGroupQuestion } from '../../model';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as _moment from 'moment';
const moment = _moment;

@Component({
    selector: 'madoc-radiobox-group',
    template: `
    <div
      [id]="item.id"
      class="component"
      [ngClass]="{ hidden: !item.visible }"
      [style.border]="isValid() ? 'none' : '1px solid red'"
    >
      <madoc-header [item]="item"></madoc-header>
      <div *ngFor="let option of item.attributes; let i = index" class="radio">
        <label
          [style.color]="isDisabled(option) ? 'darkgrey' : 'black'"
          class="option"
          [attr.for]="option.id"
          [ngClass]="{ hidden: !option.visible }"
          style="margin-right: 5px"
        >
          <input
            type="radio"
            [id]="option.id"
            [name]="item.id"
            [value]="option.value"
            [checked]="isChecked(option)"
            [disabled]="isDisabled(option)"
            class="inputRadioBox"
            [ngClass]="{ hidden: !option.visible }"
            (change)="onSelected(option.value)"
          />

          {{ option.display }}
        </label>

        <span
          *ngIf="option.optionInput != null"
          [ngClass]="{ hidden: !item.visible || !option.visible }"
        >
          <span [ngSwitch]="option.optionInput.type">
            <span *ngSwitchCase="'DATE'">
              <input
                [(ngModel)]="dates[option.id]"
                [disabled]="!isChecked(option) || isDisabled(option)"
                bsDatepicker
                [bsValue]="dates[option.id]"
                [bsConfig]="bsConfig"
                placement="bottom left"
                (ngModelChange)="onChangeDate(option, $event)"
                (bsValueChange)="onChangeDate(option, $event)"
              />
            </span>
            <span *ngSwitchDefault>
              <input
                type="text"
                style="width: 16em"
                (keyup.enter)="
                  onChangeInputText(option, option.optionInput.value)
                "
                (blur)="onChangeInputText(option, option.optionInput.value)"
                [disabled]="!isChecked(option) || isDisabled(option)"
                [(ngModel)]="option.optionInput.value"
              />
            </span>
          </span>
        </span>
      </div>
      <div style="font-size: 0.9em; color: red; clear: left" *ngIf="!isValid()">
        <br />{{ item.erro }}
      </div>
    </div>
  `
})
export class MadocRadioBoxGroupComponent implements IMadocComponent, OnInit {
    @Input() public item: RadioBoxGroupQuestion;
    @Output() public retorno$ = new EventEmitter();

    // Model para inputs de data
    dates: Date[] = [];
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(
        private renderer: Renderer2,
        private localeService: BsLocaleService
    ) {
        localeService.use('ptbrlocale');
    }

    ngOnInit() {
        const self = this;
        this.item.dirty = false;

        // Inicializa modelos de inputs de data com o valor default ou data atual
        this.item.attributes
            .filter(o => o.optionInput && o.optionInput.type === 'DATE')
            .forEach(o => {
                this.dates[o.id] = o.optionInput.defaultValue
                    ? this.getDateFromString(o.optionInput.defaultValue)
                    : new Date();
            });

        moment.locale('ptBr');
        defineLocale('ptbrlocale', ptBrLocale);
        this.bsConfig = Object.assign(
            {},
            {
                showWeekNumbers: false,
                assumeNearbyYear: true,
                rangeSeparator: ' || ',
                containerClass: 'theme-dark-blue',
                rangeInputFormat: 'DD-MM-YYYY'
            }
        );

        this.item.$answer.pipe(filter(v => v != null)).subscribe(value => {
            const v = Array.isArray(value) ? value[0] : value;
            self.item.attributes.map(a => {
                if (a.value === v) {
                    a.selected = true;
                    if (
                        Array.isArray(value) &&
                        value.length > 1 &&
                        a.optionInput != null
                    ) {
                        if (a.optionInput.type === 'DATE') {
                            this.dates[a.id] = this.getDateFromString(value[1]);
                        }
                        a.optionInput.value = value[1];
                    }
                } else {
                    a.selected = false;
                }
            });
            self.onChange(v, false);
        });
    }

    onSelected(value) {
        this.item.dirty = true;
        this.onChange(value, true);
    }

    onChange(value, actions = true) {
        const option = this.getOption(value);

        this.item.init(option);
        const choice = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid(),
            actions
        );
        this.retorno$.emit(choice);
    }

    onChangeDate(option, dateFrom) {
        this.item.dirty = true;
        // tslint:disable-next-line:triple-equals
        if (dateFrom == null || dateFrom == 'Invalid Date') {
            this.item.answer[0].other = null;
        } else {
            this.item.answer[0].other = moment(dateFrom).format('DD/MM/YYYY');
        }
        option.optionInput.value = dateFrom;
        const choice = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        this.retorno$.emit(choice);
    }

    onChangeInputText(option, value) {
        this.item.dirty = true;
        option.optionInput.value = this.item.answer[0].other = value.trim();
        const choice = new Choice(
            this.item.id,
            this.item.display,
            this.item.answer,
            this.item.isValid()
        );
        this.retorno$.emit(choice);
    }

    isDisabled(option) {
        return !option.enabled || !this.item.enabled;
    }

    isChecked(option) {
        return (
            option != null &&
            this.item.answer[0] != null &&
            option.value === this.item.answer[0].value
        );
    }

    getDateFromString(value) {
        if (value == null) {
            return null;
        }
        const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        return new Date(value.replace(pattern, '$3/$2/$1'));
    }

    getOption(value): Option {
        return this.item.attributes.filter(a => a.value === value)[0];
    }

    isValid() {
        if (!this.item.dirty) {
            return true;
        } else {
            return this.item.isValid();
        }
    }
}
