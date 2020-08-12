export class Veto {
  total: boolean;
  numero: string;
  ano: number;
  numeroIdentificador: string;
  id: string;
  dispositivos: [
    {
      numeroIdentificador: string;
      texto: string;
      conteudo: string;
      selected: boolean;
    }
  ];

  isParcial() {
    return this.total === false;
  }

  toString() {
    return `VET ${this.id} (${this.isParcial() ? 'PARCIAL' : 'TOTAL'})`;
  }
}
