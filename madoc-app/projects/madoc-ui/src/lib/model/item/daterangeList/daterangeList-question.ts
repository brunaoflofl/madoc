import { Question } from '../question';


export class DaterangeListQuestion extends Question {
    multipleValues: boolean;

    public constructor() {
        super();
    }

    build(input: any) {
        super.build(input);
        this.multipleValues = input.multipleValues;
        this.answer = this.value == null ? [] : this.value;
    }

    isValid(): boolean {
        this.erro.mensagem = '';
        if (this.required === true) {
            if (this.answer == null || this.answer.length === 0) {
                this.erro.mensagem = 'Campo de preenchimento obrigatório.';
                return false;
            } else if (this.answer[0].includes('null')) {
                this.erro.mensagem = 'A opção selecionada requer o preenchimento do campo de Data.';
                return false;
            }
        }
        return true;
    }

}
