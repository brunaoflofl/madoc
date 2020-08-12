import { Component } from '@angular/core';
import { MadocExtrasActionService } from '../madoc-extras-action/madoc-extras-action.service';
import { MadocExtrasAction } from '../madoc-extras-action/madoc-extras-action';

@Component({
  selector: 'madoc-extras-toolbar',
  templateUrl: './madoc-extras-toolbar.component.html',
})
export class MadocExtrasToolbarComponent {

    acoes: MadocExtrasAction[] = [];
    acaoFecharEdicao;

    constructor(service: MadocExtrasActionService) {
        this.acoes = service.acoes;
        this.acaoFecharEdicao = service.acaoFecharEdicao;
   }

}
