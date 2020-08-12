import { MadocStore } from '../../../service/store.service';
import { Question } from '../question';

export class MateriaQuestion extends Question {
    public regex: RegExp;
    public url = '/lexeditweb/resources/materia/search?materia=';
    public constructor() {
        super();
    }

    build(input: any) {
        super.build(input);
        this.url = input.customAttributes && input.customAttributes.length > 0
            && input.customAttributes.find(c => c.name === 'url') ?
            input.customAttributes.find(c => c.name === 'url').value : this.url;
        this.regex = input.customAttributes ? input.customAttributes.filter(c => c.name === 'regex')
            .map(c => new RegExp(c.value))[0] : null;
        this.answer = [];
    }

    getMapValue() {
        return this.answer;
    }

    executeRules(store: MadocStore) {
        for (const rule of this.getRules()) {
            rule.execute(this, store);
        }
    }

    isValid(): boolean {

        if (!this.answer) {
            this.answer = '';
        }

        if (this.required === true && this.isEmptyAnswer()) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        if (!this.isEmptyAnswer() && this.regex) {
            const r = this.answer.match(this.regex) != null;
            if (!r) {
                this.erro.mensagem = 'Matéria inválida';
            }
            return r;
        }

        this.erro.mensagem = '';
        return true;
    }

}
