import { Question } from './../question';
import { MadocStore } from '../../../service/store.service';
export class DestaqueVetoQuestion extends Question {
    public regex: RegExp;
    public url = '/lexeditweb/resources/materia/vetos/';
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
        const answer = this.isEmptyAnswer() ? null : JSON.parse(this.answer);
        const vetoNaoSelecionado = answer
            ? answer.destaqueDispositivos && answer.itensSelecionados.length === 0
            : true;
        if (this.required === true && vetoNaoSelecionado) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        this.erro.mensagem = '';
        return true;
    }
}
