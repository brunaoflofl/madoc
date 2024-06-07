import {Component, Input, OnInit} from "@angular/core";
import {Dispositivo} from "../veto.model";

@Component({
  template: `
    <ng-container *ngIf="dispostivos && dispostivos.length > 0">{{ descreverDispositivos() }}</ng-container>
  `,
  selector: 'descritor-dispositivo'
})
export class DescritorDispositivoComponent implements OnInit {

  @Input()  dispostivos: Dispositivo[];
  @Input()  numeroVeto: number;
  @Input()  anoVeto: string;

  ngOnInit() {
  }

  descreverDispositivos() {
    let texto : string = this.dispostivos.length === 1 ? 'dispositivo ' : 'dispositivos ';
    console.log('------------------------ ' + this.dispostivos.length);

    let index = 0;
    while (index < this.dispostivos.length) {
      let dispositivo = Object.assign(new Dispositivo, this.dispostivos[index]);
      let artigo = ', ';
      let inicio = index;
      let existeProximo = !!this.dispostivos[index + 1];
      console.log(dispositivo.getNumero(), existeProximo)
      if (existeProximo) {
        texto += dispositivo.getNumero();
        let isSequencial = true;
        while (existeProximo && isSequencial) {
          isSequencial = dispositivo.getNumero() + 1 === Object.assign(new Dispositivo, this.dispostivos[index+1]).getNumero();
          existeProximo = !!this.dispostivos[index + 2];
          if (isSequencial) {
            index++;
            dispositivo = Object.assign(new Dispositivo, this.dispostivos[index]);
          }
          console.log(isSequencial, existeProximo)
        }
        if (Object.assign(new Dispositivo, this.dispostivos[inicio]).getNumero() + 1 === dispositivo.getNumero()) {
          artigo = ' e ';
        } else if (inicio + 1 < index) {
          artigo = ' a '
        }
        console.log('artigo e disp final, proximo?', artigo, dispositivo.getNumero(), existeProximo)
        texto += artigo + dispositivo.getNumero();
        if (existeProximo) texto += ', ';
      } else {
        texto += ' e ' + dispositivo.getNumero();
      }
      index++;
    }
    texto += ' do veto ' + this.numeroVeto + '/'+ this.anoVeto + '.';
    console.log('------------------------ ');
    return texto;
  }
}
