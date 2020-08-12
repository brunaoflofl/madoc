export interface Modelo {
    type: string;
    uuid: string;
    properties: {
        Id: string,
        Modelo: string,
        TipoModelo: string,
        Valido: boolean,
        Elaborador: string,
        Nome: string
    };
    wizard: any;
}
