import { TextQuestion } from '../shared//text-question';
import { ValidaDados } from '../../../util/validaDados';
import { InputtextService } from '../../../service/inputtext.service';

export class InputTextQuestion extends TextQuestion {
  mask: (string | RegExp)[] | false;
  validationType = '';
  validationURL = '';
  urlValidated = false;
  urlValidationMessage = '';
  resultado: any = null;
  private inputtextService: InputtextService;

  setService(service: InputtextService) {
    this.inputtextService = service;
  }

  build(input: any) {
    super.build(input);

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
    this.erro.mensagem = "";
    if (!super.isValid()) {
      return false;
    }
    if (this.validationType && !this.isNotPreenchido()) {
      const validationTypeLower = this.validationType.toLowerCase();
      if (
        validationTypeLower == "cpf" &&
        !ValidaDados.validarCPF(this.answer)
      ) {
        this.erro.mensagem = "Informe um CPF válido.";
        return false;
      }
      if (
        validationTypeLower == "cnpj" &&
        !ValidaDados.validarCNPJ(this.answer)
      ) {
        this.erro.mensagem = "Informe um CNPJ válido.";
        return false;
      }
    }
    if (this.validationURL && !this.isNotPreenchido()) {
      if (this.urlValidated) {
        if (!!this.urlValidationMessage) {
          this.erro.mensagem = this.urlValidationMessage;
          return false;
        }
      } else {
        this.urlValidated = true;
        this.urlValidationMessage = "";
        //  TODO - Refatorar chamadas a isValid() para permitir chamadas síncronas à url de validação
        // Da forma que está, a chamada abaixo não está síncrona e a validação ocorre apenas
        // por causa da validação acima quando o método é chamado repetidamente para o mesmo valor.
        this.validateURL()
          .then((resultado) => {
            if (!resultado.body.isValid) {
              this.erro.mensagem = resultado.body.errorMessage;
              this.urlValidationMessage = resultado.body.errorMessage;
            }
          })
          .catch((error) => {
            this.erro.mensagem = "Erro ao validar a URL.";
            this.urlValidationMessage = this.erro.mensagem;
          });
      }
    }
    console.log("retorna true")
    return true;
  }

  private async validateURL(): Promise<any> {
    try {
      const resultado = await this.inputtextService
        .checkUrlValue(this.validationURL, this.answer)
        .toPromise();
      this.resultado = resultado;
      return resultado;
    } catch (error) {
      console.error("Erro ao verificar a URL:", error);
      this.erro.mensagem = "Erro ao validar a URL.";
      return this.erro.mensagem;
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

  resetUrlValidationControls(){
    this.urlValidated = false;
    this.urlValidationMessage = '';
  }
}
