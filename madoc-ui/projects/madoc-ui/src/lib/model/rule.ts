import { ISharedProperties } from './iShared-properties';
import { MadocStore } from '../service/store.service';

export class Rule {

    public constructor(private id: string, private valor: string) { }

    public execute(item: ISharedProperties, store: MadocStore) {
        let result;

        if (this.valor == null) {
            return;
        }

        try {

            result = eval.call(null, store.getValue(this.valor));
        } catch (err) {
            result = this.valor;
        }

        item[this.id] = this.getNormalizedValue(result);
    }

    private getNormalizedValue(value) {
        if (value == null) {
            return null;
        }

        if (typeof value === 'boolean' || Number.isInteger(value)) {
            return value;
        }

        if (value === 'true' || value === 'false') {
            return value === 'true';
        }

        return value.trim();
    }
}
