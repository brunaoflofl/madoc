import { TextQuestion } from '../shared//text-question';
import { ValidaDados } from '../../../util/validaDados';
import { InputtextService } from '../../../service/inputtext.service';

export class InputTextQuestion extends TextQuestion {
  mask: (string | RegExp)[] | false;
  validationType = '';
  validationURL = '';
  resultado: any = null;
  private inputtextService: InputtextService;

  setService(service: InputtextService) {
    this.inputtextService = service;
  }

  build(input: any) {
    super.build(input);
    console.log("input::", input);

    this.validationType = input.validationType;
    this.validationURL = input.validationURL;
    this.validaMask(input);
  }

  validaMask(input: any){
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
    if (this.validationURL && !this.isNotPreenchido()) {
      console.log("valor::", this.validationURL);
      console.log("this.answer::", this.answer);
        // Chamada assíncrona
        this.validateURL().then(isValid => {
          if (!isValid) {
              // Se a validação falhar, atualiza a mensagem de erro
              this.erro.mensagem = this.resultado.errorMessage;
              return false;
          }
      }).catch(error => {
          console.error('Erro ao verificar a URL:', error);
          this.erro.mensagem = 'Erro ao validar a URL.';
      });
    }
  
    return true;
  }

  private validateURL() {
    try {
      this.resultado = this.inputtextService.checkSedolNumber(this.validationURL, this.answer).toPromise();
      console.log("result", this.resultado);
      return this.resultado.isValid;
    } catch (error) {
      console.error('Erro ao verificar o nome', error);
      this.erro.mensagem = 'Erro ao validar o SEDOL.';
      return false;
    }
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
