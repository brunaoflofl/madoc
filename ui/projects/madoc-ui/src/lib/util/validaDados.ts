export class ValidaDados {

    public static validarCPF(cpf: string): boolean {
        cpf = cpf.replace(/\D/g, '');
    
        const isAllDigitsEqual = cpf.split('').every((char, index, array) => char === array[0]);
        if (isAllDigitsEqual) {
            return false;
        }
    
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
    
        if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
          return false;
        }
    
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
    
        if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
          return false;
        }
    
        return true;
      }
    
      public static validarCNPJ(cnpj: string): boolean {
    
        cnpj = cnpj.replace(/\D/g, '');
    
        let soma = 0;
        let peso = 5;
        for (let i = 0; i < 12; i++) {
            soma += parseInt(cnpj.charAt(i)) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        let resto = soma % 11;
        let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    
        if (digitoVerificador1 !== parseInt(cnpj.charAt(12))) {
            return false;
        }
    
        soma = 0;
        peso = 6;
        for (let i = 0; i < 13; i++) {
            soma += parseInt(cnpj.charAt(i)) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        resto = soma % 11;
        let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    
        if (digitoVerificador2 !== parseInt(cnpj.charAt(13))) {
            return false;
        }
    
        return true;
      }
}
