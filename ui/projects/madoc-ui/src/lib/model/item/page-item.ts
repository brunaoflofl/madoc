import { Rule } from './../rule';
import { ISharedProperties } from '../iShared-properties';
import { Input } from '../input';
import { Subject } from 'rxjs';
import { IPageItem } from '../iPageItem';
import { MadocStore } from '../../service/store.service';

export abstract class PageItem implements IPageItem, ISharedProperties {
    id: string;
    display: string;
    type: string;

    _value: any;
    defaultValue: any;
    defaultValueSatisfiesRequiredQuestion: boolean;

    enabled: boolean;
    required: boolean;
    visible: boolean;

    // duvidas
    optionInput: Input;

    $status: Subject<boolean> = new Subject<boolean>();
    _active = false;

    constructor() {}

    abstract executeRules(content: MadocStore);

    build(input: any) {
        this.id = input.id;
        this.display = input.display;
        this.type = input.type;
        this._value = input.value;
        this.defaultValue = input.defaultValue;
        this.defaultValueSatisfiesRequiredQuestion =
            input.defaultValueSatisfiesRequiredQuestion;

        this.enabled = this.getValue(input.enabled);
        this.required = this.getValue(input.required);
        this.visible = this.getValue(input.visible);

        if (this.display == null) {
            this.display = this._value;
        }
    }

    public set active(v: boolean) {
        this._active = v;
        this.$status.next(v);
    }

    public get value() {
        return this._value;
    }

    public set value(value) {
        this._value = value;
    }

    getValue(value) {
        if (value == null) {
            return null;
        }

        if (typeof value === 'boolean') {
            return value;
        }
        return value === 'true' || value === 'false'
            ? value === 'true'
            : this.isStatement(value)
            ? false
            : value.trim();
    }

    isStatement(texto) {
        return (
            texto != null &&
            typeof texto !== 'undefined' &&
            isNaN(texto) &&
            texto.startsWith('{') &&
            texto.endsWith('}')
        );
    }

    pushRule(rules: Rule[], obj: any, field: string) {
        if (this.isStatement(obj[field])) {
            rules.push(new Rule(field, obj[field]));
        }
    }
}
