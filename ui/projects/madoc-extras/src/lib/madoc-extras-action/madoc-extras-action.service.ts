import { MadocExtrasAction } from './madoc-extras-action';
import { Injectable } from '@angular/core';
@Injectable()
export class MadocExtrasActionService {
    ACTION_SALVAR_DOCUMENTO = new MadocExtrasAction('Salvar', 'glyphicon-save-file', 'Salvar na área pessoal');
    ACTION_FECHAR_EDICAO = new MadocExtrasAction('Fechar', 'glyphicon-remove');
    ACTION_VOLTAR = new MadocExtrasAction('Voltar', 'glyphicon-arrow-left', 'Voltar para a listagem de modelos');
    ACTION_VISUALIZAR = new MadocExtrasAction('Visualizar', 'glyphicon-print', 'Gerar e visualizar documento madoc em formato PDF');
    ACTION_FECHAR_VSUALIZACAO = new MadocExtrasAction('Fechar visualização', 'glyphicon-remove');

    acoes = [this.ACTION_SALVAR_DOCUMENTO, this.ACTION_VISUALIZAR, this.ACTION_VOLTAR];
    acaoFecharEdicao = this.ACTION_FECHAR_EDICAO;
    acaoFecharVisualizacao = this.ACTION_FECHAR_VSUALIZACAO;
}
