export interface API {
    getAcao(): string;
    getTipoDocumento(): string;
    getNomeDocumento(): string;
    getUrlAbrir(): string;
    getUrlSalvar(): string;
    getUrlCSS(): string;
    fechar(): void;
    notificaDocumentoSalvo(): void;
}
