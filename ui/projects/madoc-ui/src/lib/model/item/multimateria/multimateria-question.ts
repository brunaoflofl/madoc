import { MadocStore } from '../../../service/store.service';
import { Question } from '../question';

export class MultiMateriaQuestion extends Question {
    public regex: RegExp;
    maxEntries = 0;
    urlMateria = '/lexeditweb/resources/materia/search?materia=';
    urlEmenta = '/lexeditweb/resources/materia/get?materia=';
    public constructor() {
        super();
    }

    build(input: any) {
        super.build(input);
        this.maxEntries = input.customAttributes && input.customAttributes.length > 0
            && input.customAttributes.find(c => c.name === 'maxEntries') ?
            input.customAttributes.find(c => c.name === 'maxEntries').value : 0;
        this.urlMateria = input.customAttributes && input.customAttributes.length > 0
            && input.customAttributes.find(c => c.name === 'urlMateria') ?
            input.customAttributes.find(c => c.name === 'urlMateria').value : this.urlMateria;
        this.urlEmenta = input.customAttributes && input.customAttributes.length > 0
            && input.customAttributes.find(c => c.name === 'urlEmenta') ?
            input.customAttributes.find(c => c.name === 'urlEmenta').value : this.urlEmenta;
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
            this.answer = [''];
        }

        if (this.required === true && this.isEmptyAnswer()) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        if (!this.isEmptyAnswer() && this.regex) {
            const r = this.answer.find(el => el.identificacao.match(this.regex) == null);
            if (r) {
                this.erro.mensagem = 'Matéria inválida no índice' + r;
            }
            return !r;
        }

        this.erro.mensagem = '';
        return true;
    }

}
