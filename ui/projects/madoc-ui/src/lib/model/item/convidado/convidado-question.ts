import { Rule } from './../../rule';
import { Field } from './../../field';
import { Option } from '../../option';
import { Question } from '../question';
import { MadocStore } from '../../../service/store.service';

export class ConvidadoQuestion extends Question {
    attributes: Option[];
    fields: Field[] = [];
    maxEntries = 0;
    labelConvidado = 'convidado';

    private _rules: Rule[] = [];

    public constructor() {
        super();
    }

    build(input: any) {

        const caMaxEntries = this.getCustomAttributeByName(input, 'maxEntries');
        if (caMaxEntries) {
            if(!this.isStatement(caMaxEntries.value)) {
                this.maxEntries = Number(caMaxEntries.value);
            }
            this._rules.push(new Rule('maxEntries', caMaxEntries.value));
        }

        const caLabelConvidado = this.getCustomAttributeByName(input, 'labelConvidado');
        if (caLabelConvidado) {
            if(!this.isStatement(caLabelConvidado.value)) {
                this.labelConvidado = caLabelConvidado.value;
            }
            this._rules.push(new Rule('labelConvidado', caLabelConvidado.value));
        }

        if (input.customFields && input.customFields.length > 0) {
            input.customFields.forEach(element => {
                const field = new Field(element);
                this.fields.push(field);
                field.rules = [];
                if (this.isStatement(element.visible)) {
                    field.rules.push(new Rule('visible', element.visible));
                }
                if (this.isStatement(element.enabled)) {
                    field.rules.push(new Rule('enabled', element.enabled));
                    field.enabledRule = element.enabled;
                }
                if (this.isStatement(element.required)) {
                    field.requiredRule = element.required;
                }
            });
        }

        super.build(input);

        this.answer = [];
    }

    set value(value) {
        const self = this;
        if (this.attributes != null) {
            this.attributes.forEach(a => {
                if (a != null) {
                    if (a.value === value) {
                        self.value = value;
                        a.selected = true;
                    } else {
                        a.selected = false;
                    }
                }
            });
        }
    }

    getMapValue() {
        return this.answer;
    }

    executeRules(store: MadocStore) {
        for (const rule of this.getRules()) {
            rule.execute(this, store);
        }
        this._rules.forEach(rule => rule.execute(this, store));
        this.fields.forEach(field => field.rules.forEach(r => r.execute(field, store)));
    }

    executeInternetRule() {

    }

    findByValue(value) {
        return this.attributes.filter(a => a.value === value)[0];
    }

    findByName(name) {
        return this.attributes.filter(a => a.display === name)[0];
    }

    isValid(): boolean {
        this.erro.mensagem = '';

        if (this.required === true && (this.answer == null || this.answer[0] == null)) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        if (this.answer != null && this.answer.length > 0
            && this.answer.filter(json => !this.isValidJsonvalue(json)).length > 0) {
            this.erro.mensagem = 'Campo de preenchimento obrigatório.';
            return false;
        }

        return true;
    }


    isValidFieldValue(field, obj) {
        const me = this.fields.filter(f => f.name === field)[0];

        if (me != null && (me.required === true || this.evaluateRequired(me, obj)) && me.visible === true) {
            return obj[field] != null && obj[field].trim() !== '';
        }

        return true;
    }

    isValidJsonvalue(json) {
        const obj = JSON.parse(json);

        // tslint:disable-next-line:forin
        for (const field in obj) {
            if (!this.isValidFieldValue(field, obj)) {
                return false;
            }
        }
        return true;
    }

    evaluateRequired(field, obj) {

        if (field.requiredRule == null) {
            return false;
        }

        return eval.call(null, field.requiredRule
            .replace(/nome/g, '\'' + obj['nome'] + '\'')
            .replace(/cargo/g, '\'' + obj['cargo'] + '\'')
            .replace(/tratamento/g, '\'' + obj['tratamento'] + '\'')
            .replace(/representanteDe/g, '\'' + obj['representanteDe'] + '\'')
            .replace(/[{}]/g, ''));
    }
}
