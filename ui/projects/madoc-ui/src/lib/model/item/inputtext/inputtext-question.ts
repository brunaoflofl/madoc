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
    this.erro.mensagem = '';
    if (!super.isValid()) {
      return false;
    }
    if (this.validationType && !this.isNotPreenchido()) {
      const validationTypeLower = this.validationType.toLowerCase();
      if (validationTypeLower == 'cpf' && !ValidaDados.validarCPF(this.answer)) {
        this.erro.mensagem = 'Informe um CPF válido.';
        return false;
      }
      if (validationTypeLower == 'cnpj' && !ValidaDados.validarCNPJ(this.answer)) {
        this.erro.mensagem = 'Informe um CNPJ válido.';
        return false;
      }    
    }
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
