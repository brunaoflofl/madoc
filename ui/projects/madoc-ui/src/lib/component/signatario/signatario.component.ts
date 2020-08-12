import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { filter } from 'rxjs/operators';

import { Choice } from '../../model/choice';
import { SignatarioQuestion } from '../../model/item/signatario/signatario-question';
import { madocScrollTo } from '../../util/scroll';
import { IMadocComponent } from '../shared/madoc-abstract.component';

@Component({
  selector: 'madoc-signatario',
  templateUrl: './signatario.component.html',
  styleUrls: ['./signatario.component.css']
})
export class MadocSignatarioComponent
  implements IMadocComponent, OnInit, AfterViewChecked, AfterViewInit {
  @Input()
  public item: SignatarioQuestion;
  @Output()
  retorno$ = new EventEmitter();
  @ViewChildren('inputAutor')
  inputAutor: QueryList<ElementRef>;
  @ViewChild('scrollMe', { static: true })
  myScrollContainer: ElementRef;

  parlamentares = [{ id: '', nome: '', cargo: '' }];

  focus = false;

  constructor() {}

  ngAfterViewInit(): void {
    const self = this;
    this.item.onFocus.subscribe(offset => {
        this.item.dirty = true;
        self.myScrollContainer.nativeElement.scrollIntoView({block: 'center', behaviour: 'smooth'});
      });
  }

  ngAfterViewChecked() {
    if (
      this.inputAutor.last != null &&
      this.inputAutor.last.nativeElement['id'] === '' &&
      this.focus
    ) {
      this.inputAutor.last.nativeElement.focus();
      this.focus = false;
    }
  }

  ngOnInit() {
    this.item.$answer
      .pipe(filter(value => value != null && value !== ''))
      .subscribe(value => {
        this.createAuthors(value);
      });
  }

  createAuthors(value) {
    this.parlamentares = [];

    if (typeof value === 'string') {
      if (this.item.answer.indexOf(value) === -1) {
        if (this.item.findByValue(value)) {
          this.parlamentares.push({
            id: value,
            nome: this.item.findByValue(value)['display'],
            cargo: ''
          });
          this.onChange();
        } else {
          this.parlamentares = [{ id: '', nome: '', cargo: '' }];
        }
      }
    } else if (Array.isArray(value) && value.length % 2 === 0) {
      for (let i = 0; i < value.length; i += 2) {
        if (this.item.answer.indexOf(value[i]) === -1) {
          if (this.item.findByValue(value[i])) {
            this.parlamentares.push({
              id: value[i],
              nome: this.item.findByValue(value[i])['display'],
              cargo: value[i + 1]
            });
            this.onChange();
          }
        }
      }
    }
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
    const temp = this.parlamentares
      .filter(p => p.id !== '')
      .map(p => [p.id, p.cargo ? p.cargo : '']);
    this.item.answer = [].concat.apply([], temp);
  }

  isDisabled(item?) {
    return this.item.enabled !== true;
  }

  onSelect(value) {
    let found = this.parlamentares.filter(p => p.nome === value);

    if (found.length === 2) {
      found = this.parlamentares.filter(p => p.id === '');
      found[0].nome = '';
    }

    const selected = this.item.findByName(value);

    if (selected) {
      this.parlamentares.filter(p => p.nome === value)[0].id = selected.value;
      this.onChange();
    }
  }

  onBlur(i) {
    if (
      this.parlamentares[i].nome == null ||
      this.parlamentares[i].nome === ''
    ) {
      this.parlamentares[i].id = '';
      this.onChange();
    } else {
      this.onTypeadBlur(this.parlamentares[i].nome);
    }
  }

  onTypeadBlur(nome) {
    const selected = this.item.findByName(nome);

    if (!selected) {
      const parlamentar = this.parlamentares.filter(p => p.nome === nome)[0];
      parlamentar.id = parlamentar.nome = parlamentar.cargo = '';
      this.onChange();
    } else {
      this.onSelect(nome);
    }
  }

  isCargoDisabled(i) {
    return (
      this.parlamentares[i].nome == null || this.parlamentares[i].nome === ''
    );
  }

  updateCargo() {
    this.onChange();
  }

  add() {
    this.parlamentares.push({ id: '', nome: '', cargo: '' });
    this.focus = true;
  }

  delete(i) {
    this.parlamentares.splice(i, 1);
    this.onChange();
  }

  moveUp(i) {
    this.parlamentares.splice(i - 1, 0, this.parlamentares.splice(i, 1)[0]);
    this.onChange(true);
  }

  moveDown(i) {
    this.parlamentares.splice(i + 1, 0, this.parlamentares.splice(i, 1)[0]);
    this.onChange(true);
  }

  canAdd() {
    return (
      this.parlamentares.filter(p => p.id === '').length === 0 &&
      this.item.isValid()
    );
  }

  canGoUp(i) {
    return (
      !this.isFirst(i) &&
      this.parlamentares.length > 1 &&
      this.item.attributes.filter(a => a.display === this.parlamentares[i].nome)
        .length > 0
    );
  }

  canGoDown(i) {
    return !this.isLast(i) && this.isNomeValido(i + 1);
  }

  canDelete(i) {
    return this.parlamentares.length > 1;
  }

  isFirst(i) {
    return i === 0;
  }

  isLast(i) {
    return i === this.parlamentares.length - 1;
  }

  isNomeValido(i) {
    if (this.parlamentares[i] == null) {
      return false;
    }
    if (
      !this.item.dirty ||
      (this.parlamentares.length > 0 &&
        i === this.parlamentares.length - 1 &&
        this.parlamentares[i].nome === '' &&
        this.parlamentares[i].cargo === '')
    ) {
      return true;
    }
    return (
      this.item.attributes.filter(a => a.display === this.parlamentares[i].nome)
        .length > 0
    );
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }
}
