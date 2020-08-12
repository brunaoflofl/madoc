export interface API {
    getAcao(): string;
    getTipoDocumento(): string;
    getNomeDocumento(): string;
    getUrlAbrir(): string;
    getUrlSalvar(): string;
    fechar(): void;
    notificaDocumentoSalvo(): void;
}
