import { Metadados } from './metadata-dto';

export interface ModeloListagem {
    id: string;
    metadata: Metadados;
    hidden: boolean;
    previous: ModeloListagem;
}
