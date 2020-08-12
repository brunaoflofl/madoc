import * as moment from 'moment';


  export function deserialize(dados: string): any {
    return JSON.parse(dados, this.reviver);
  }

  export function reviver(chave: any, valor: any): any {

    const patternDate = /(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/;

    if (typeof chave === 'string' && typeof valor === 'string') {
      if (patternDate.test(valor)) {
        try {
          return moment(valor, 'YYYY-MM-DD\THH:mm:ss');
        } catch (e) { }
      }
    }

    return valor;

  }


