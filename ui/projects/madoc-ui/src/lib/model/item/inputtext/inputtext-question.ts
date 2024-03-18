import { TextQuestion } from '../shared//text-question';
import { ValidaDados } from '../../../util/validaDados';

export class InputTextQuestion extends TextQuestion {
  mask: (string | RegExp)[] | false;
  validationType = '';

  constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.validationType = input.validationType;
    if(this.validationType){
      this.mask = this.getMask(this.validationType)
    } else {
    this.mask = input.mask ? eval(input.mask.replace(/\\/g, '\\')) : false;

    }
  }

  public isValid(): boolean {
    const validationTypeLower = this.validationType ? this.validationType.toLowerCase() : '';
      if (this.required === true && (!this.answer || this.answer.length === 0)) {
        this.erro.mensagem = (validationTypeLower === "cpf") ? ' Informe um cpf válido.' : (validationTypeLower === "cnpj") ? ' Informe um cnpj válido.' : 'Dados inválidos';
        return false;
      } else if (this.answer && this.answer.length === 14){
        this.erro.mensagem = ' Informe um cpf válido.';
        return ValidaDados.validarCPF(this.answer);
      } else if (this.answer && this.answer.length === 18){
        this.erro.mensagem = ' Informe um cnpj válido.';
        return ValidaDados.validarCNPJ(this.answer);
      }    
    this.erro.mensagem = '';
    return true;
  }

  getMask(validationType: string) {
      switch (validationType.toLowerCase()) {
          case "cpf":
              return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
          case "cnpj":
              return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
          default:
              // TO DO: add outras mascaras
              return [];
      }
  }  

}
