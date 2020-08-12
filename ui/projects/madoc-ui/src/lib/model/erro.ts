export class Erro {
  public mensagem = '';
  public detalhe = '';

  constructor(public id: string, public display: string) { }

  public toString() {
    return this.mensagem;
  }
}
