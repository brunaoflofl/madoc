import { ISharedProperties } from './iShared-properties';
import { Rule } from './rule';

export const condicoes = [
    { id: 'o-condicao-nao-informado', value: 'não informado' },
    { id: 'o-condicao-testemunha', value: 'como testemunha' },
    { id: 'o-condicao-investigado', value: 'como investigado' },
    { id: 'o-condicao-indiciado', value: 'como indiciado' },
    { id: 'o-condicao-reu', value: 'como réu' }
];

export const tratamentos = [
    { id: 'Senhor', value: 'o Senhor' },
    { id: 'Senhora', value: 'a Senhora' },
    { id: 'Exmo.', value: 'o Exmo. Sr.' },
    { id: 'Exma.', value: 'a Exma. Sra.' },
    { id: 'Dr.', value: 'o Doutor' },
    { id: 'Dra.', value: 'a Doutora' }
];


export class Field implements ISharedProperties {
    id;
    type;
    value;
    display: string;
    name: string;
    required: boolean;
    enabled: boolean;
    visible: boolean;
    rules: Rule[] = [];
    requiredRule: String;
    enabledRule: String;

    constructor(element) {
        this.display = element['display'];
        this.name = element['name'];
        this.required = (element['required'] === 'true');
        this.enabled = (element['enabled'] === 'true');
        this.visible = (element['visible'] === 'true');
    }
}
