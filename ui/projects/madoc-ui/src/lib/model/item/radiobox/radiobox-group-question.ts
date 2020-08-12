import { MadocStore } from '../../../service/store.service';
import { Question } from '../question';
import { Option } from '../../option';
import { Rule } from '../../rule';
import { Answer } from '../../answer';
import { MultiValueQuestion } from '../shared/multi-value.question';

export class RadioBoxGroupQuestion extends MultiValueQuestion {

    public constructor() {
        super();
    }

    build(input: any) {
        super.build(input);
    }

    public setQuestionValue(value) {
        if (value == null) {
            return;
        }
        const selecionado = this.attributes.filter(a => a.value === value || a.value === value[0]);
        if (selecionado.length > 0) {
            this.init(selecionado[0]);
            super.setQuestionValue(value);
        }
    }

    public isValid(): boolean {
        this.erro.mensagem = '';
        let retorno = true;

        if (this.required === true && (this.answer == null || this.answer === '')) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        if (this.required === true && this.defaultValueSatisfiesRequiredQuestion === false &&
            // tslint:disable-next-line:triple-equals
            this.answer == this.defaultValue) {
            this.erro.mensagem =
                'O valor sugerido inicialmente deve ser modificado pelo usuário.';
            return false;
        }
        this.answer.map(a => {
            const attr = this.getOption(a.value);
            if (attr != null && attr.hasOwnProperty('optionInput')) {

                if (attr.optionInput.value == null || attr.optionInput.value === '' ||
                    attr.optionInput.value.toString() === 'Invalid Date') {
                    if (attr.optionInput.type !== 'DATE') {
                        this.erro.mensagem = 'A opção selecionada requer o preenchimento do campo de texto';
                    } else {
                        this.erro.mensagem = 'A opção selecionada requer o preenchimento correto do campo de Data';
                    }
                    retorno = false;
                }

                if (attr.optionInput.type === 'TEXT' && this.required === true &&
                    attr.optionInput.value === attr.optionInput.defaultValue) {
                    this.erro.mensagem =
                        'O valor sugerido inicialmente deve ser modificado pelo usuário.';
                    retorno = false;
                }

                if (attr.optionInput.type === 'INTEGER' && (attr.optionInput.value == null || !attr.optionInput.value.match(/^\d+$/))) {
                    this.erro.mensagem = 'O número informado é inválido';
                    retorno = false;
                }
                if (attr.optionInput.type === 'DATE' && this.required === true) {
                    if (attr.optionInput.value == null || attr.optionInput.value.toString() === 'Invalid Date') {
                        this.erro.mensagem = 'A opção selecionada requer o preenchimento do campo de Data';
                    }
                }
            }
        });

        return retorno;
    }

    private getOption(value) {
        return this.attributes.filter(a => a.value === value)[0];
    }
}
