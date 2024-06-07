export class Veto {
  total: boolean;
  numero: string;
  ano: number;
  numeroIdentificador: string;
  id: string;
  dispositivos: Dispositivo[];

  isParcial() {
    return this.total === false;
  }

  toString() {
    return `VET ${this.id} (${this.isParcial() ? 'PARCIAL' : 'TOTAL'})`;
  }
}

export class Dispositivo {
  numeroIdentificador: string;
  texto: string;
  conteudo: string;
  selected: boolean;

  public getNumero() {
    const ids = this.numeroIdentificador.split('.');
    return !!ids && ids.length > 2 ? Number(ids[ids.length - 1]) : null;
  }
}
