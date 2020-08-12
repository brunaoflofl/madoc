import { Repositorio } from './repositorio';
import { State } from '@lexml/madoc-ui';

export interface Documento {
    readonly nome: string;
    tipoDocumento: string;
    modelo: {
        id: string;
        nome?: string;
    };
    repositorio: Repositorio;
    elaborador?: string;
    estado?: State;
}
