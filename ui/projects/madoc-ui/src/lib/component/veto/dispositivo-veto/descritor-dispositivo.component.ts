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
    if (this.dispostivos.length == 1) {
      texto = "dispositivo " + this.converterParaDispositivo(0).getNumero();
    } else {
      let index = 0;
      while (index < this.dispostivos.length) {
        let dispositivoAtual = this.converterParaDispositivo(index);
        let inicio = index; // Marca o indice do primeiro dispositivo que foi comparado.
        let existeProximo = !!this.dispostivos[index + 1];

        if (existeProximo) {
          texto += dispositivoAtual.getNumero();
          let isSequencial = true;

          while (existeProximo && isSequencial) {
            isSequencial = this.isDispositivoSaoSequenciais(dispositivoAtual, this.converterParaDispositivo(index + 1));
            existeProximo = !!this.dispostivos[index + 2];
            if (isSequencial) {
              index++;
              dispositivoAtual = this.converterParaDispositivo(index);
            }
          }

          let artigo = this.decidirProximoArtigoOuVirgula(inicio, index);

          if (inicio < index) texto += artigo + dispositivoAtual.getNumero();
          if (existeProximo) texto += ', ';

        } else {
          texto += ' e ' + dispositivoAtual.getNumero();
        }
        index++;
      }
    }
    texto += ' do veto ' + this.numeroVeto + '/'+ this.anoVeto + '.';

    return texto;
  }

  private converterParaDispositivo(index: number) {
    return Object.assign(new Dispositivo, this.dispostivos[index]);
  }

  private isDispositivoSaoSequenciais(dispositivoAtual: Dispositivo, dispositivoPosterior: Dispositivo) {
    return dispositivoAtual.getNumero() + 1 == dispositivoPosterior.getNumero();
  }

  private decidirProximoArtigoOuVirgula(indexInicial: number, indexAtual: number) {
    let artigo = ', ';
    let dispositivoInicial = this.converterParaDispositivo(indexInicial);
    let dispositivoAtual = this.converterParaDispositivo(indexAtual);

    if (this.isDispositivoSaoSequenciais(dispositivoInicial, dispositivoAtual)) {
      artigo = ' e ';
    } else if (indexInicial + 1 < indexAtual) {
      artigo = ' a '
    }
    return artigo;
  }
}
