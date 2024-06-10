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
    if (this.dispostivos.length == 1)
      return `dispositivo ${this.recuperarNumeroDispositivo(0)} do veto ${this.numeroVeto}/${this.anoVeto}.`;

    const gruposDispositivos = this.agruparDispositivosSequenciais();
    const descricaoDispositivos = this.descreverDispositivosAgrupados(gruposDispositivos);
    return `dispositivos ${descricaoDispositivos} do veto ${this.numeroVeto}/${this.anoVeto}.`;
  }

  private recuperarNumeroDispositivo(index: number) {
    return +this.dispostivos[index].numeroIdentificador.split('.')[2];
  }

  /**
   * Coloca uma virgula entre os grupos e um artigo 'e' para
   * o ultimo elemento, Ex. '1 a 3, 5, 7 e 9 e 10'
   */
  descreverDispositivosAgrupados(gruposDispositivos: string[]) {
    if (gruposDispositivos.length == 1) {
      return gruposDispositivos[0];
    }

    let texto= '';
    gruposDispositivos.forEach(function (el, index) {
      if (!!gruposDispositivos[index + 1]) {
        texto += el + ', ';
      } else {
        texto = texto.substring(0, texto.length-2); // Tira a ultima virgula
        texto += ' e ' + el;
      }
    });

    return texto
  }

  /**
   * Decide a melhor forma de agrupar dispositivos em um array,
   * caso haja uma sequencia entre eles. Ex. ['1 a 3', '5', '7', '9 e 10']
   */
  agruparDispositivosSequenciais() {
    let sequenciaDispositivos: string[] = [];
    let index = 0;
    while (index < this.dispostivos.length) {
      let numeroDispositivo = this.recuperarNumeroDispositivo(index);
      let existeProximo = !!this.dispostivos[index + 1];

      if (existeProximo) {
        let isSequencial = true;
        let numeroDispositivoAtual = numeroDispositivo;

        while (isSequencial && existeProximo) {
          let proximoNumeroDispositivo = this.recuperarNumeroDispositivo(index + 1);
          isSequencial = numeroDispositivoAtual + 1 === proximoNumeroDispositivo;
          if (isSequencial) {
            existeProximo = !!this.dispostivos[index + 2];
            index++;
            numeroDispositivoAtual = this.recuperarNumeroDispositivo(index);
          }
        }

        let qtdDispositivosEmSequencia = numeroDispositivoAtual - numeroDispositivo;
        sequenciaDispositivos.push(qtdDispositivosEmSequencia > 0
          ? numeroDispositivo + this.decidirSeparador(qtdDispositivosEmSequencia) + numeroDispositivoAtual
          : numeroDispositivo.toString());

      } else {
        sequenciaDispositivos.push(numeroDispositivo.toString());
      }
      index++;
    }

    return sequenciaDispositivos;
  }

  private decidirSeparador(qtdDispositivosEmSequencia: number) {
    if (qtdDispositivosEmSequencia == 1) {
      return ' e ';
    } else if (qtdDispositivosEmSequencia > 1) {
      return ' a '
    }
    return ', ';
  }
}
