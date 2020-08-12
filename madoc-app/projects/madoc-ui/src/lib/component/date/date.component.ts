import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Choice, DateQuestion } from '../../model';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'madoc-date',
  template: `
    <div
      class="component"
      [ngClass]="{ hidden: !item.visible }"
      [style.border]="isValid() ? 'none' : '1px solid red'"
    >
      <madoc-header [item]="item"></madoc-header>
      <input
        [(ngModel)]="data"
        [disabled]="!item.enabled"
        bsDatepicker
        [bsValue]="data"
        [bsConfig]="bsConfig"
        placement="bottom left"
        (ngModelChange)="onSelected($event)"
        (bsValueChange)="onSelected($event)"
        class="inputData"
      />

      <madoc-error [item]="item"></madoc-error>
    </div>
  `
})
export class MadocDateComponent implements OnInit {
  @Input() public item: DateQuestion;
  @Output() public retorno$ = new EventEmitter();
  bsConfig: Partial<BsDatepickerConfig>;

  data = new Date();

  constructor(private localeService: BsLocaleService) {
    localeService.use('ptbrlocale');
  }

  public ngOnInit() {
    const self = this;
    this.data = moment(this.item.answer[0].other, 'DD-MM-YYYY').toDate();
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

    this.item.$answer.pipe(filter(d => d != null)).subscribe(value => {
      if (Array.isArray(value)) {
        this.data = moment(value[1], 'DD-MM-YYYY').toDate();
        this.item.answer[0].value = value[0];
        this.item.answer[0].other = value[1];
      } else {
        this.data = moment(value, 'DD-MM-YYYY').toDate();
        this.item.answer[0].value = 'date';
        this.item.answer[0].other = value;
      }
      self.onChange(false);
    });
  }

  onSelected(dateFrom) {
    this.item.dirty = true;
    // tslint:disable-next-line:triple-equals
    if (dateFrom == null || dateFrom.toString() == 'Invalid Date') {
      this.item.answer[0].other = null;
    } else {
      this.item.answer[0].other = moment(dateFrom).format('DD/MM/YYYY');
    }
    this.onChange();
  }

  onChange(actions = true) {
    const choice = new Choice(
      this.item.id,
      this.item.display,
      this.item.answer,
      this.item.isValid(),
      actions
    );
    this.retorno$.emit(choice);
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }
}
