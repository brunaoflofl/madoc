import { Veto } from '../veto.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'madoc-dispositivo-veto',
  templateUrl: './dispositivo-veto.component.html',
  styleUrls: ['./dispositivo-veto.component.css']
})
export class MadocDispositivoVetoComponent implements OnInit {
  form: FormGroup;

  filteredDispositivos = [];

  @Input() veto: Veto;
  @Output() change = new EventEmitter<boolean>();
  @Input() disabled: boolean;

  ngOnInit() {
    this.form = new FormGroup({
      filtro: new FormControl({ value: null, disabled: this.disabled })
    });

    this.form.get('filtro').valueChanges.subscribe(value => {
      this.filteredDispositivos = [];
      this.veto.dispositivos.forEach(d => {
        const texto = d.texto.toUpperCase();
        const numeroIdentificador = d.numeroIdentificador.toUpperCase();
        const filter = value.toUpperCase();

        if (texto.includes(filter) || numeroIdentificador.includes(filter)) {
          this.filteredDispositivos.push(d);
        }
      });
    });
  }

  remove(dispositivo) {
    if (!this.disabled) {
      dispositivo['selected'] = false;
      this.change.emit(true);
    }
  }

  getDispositivosWithFilter() {
    return this.isFilterDisabled()
      ? this.veto.dispositivos
      : this.filteredDispositivos;
  }

  getDispositivosSelecionados() {
    return this.veto.dispositivos
      .filter(d => d['selected'] === true)
      .sort(this.compare);
  }

  onSelected(dispositivo) {
    dispositivo['selected'] = !dispositivo['selected'];
    this.change.emit(true);
  }

  isFilterDisabled() {
    return (
      this.form.get('filtro').value === null ||
      this.form.get('filtro').value.trim() === ''
    );
  }

  compare(a: any, b: any) {
    const arrA = a.numeroIdentificador.split('.');
    const arrB = b.numeroIdentificador.split('.');

    if (+arrA[1] - +arrB[1] !== 0) {
      return +arrA[1] - +arrB[1];
    } else if (+arrA[0] - +arrB[0] !== 0) {
      return +arrA[0] - +arrB[0];
    } else {
      return +arrA[2] - +arrB[2];
    }
  }

  clearFiltro() {
    (this.form.get('filtro') as FormControl).reset();
  }
}
