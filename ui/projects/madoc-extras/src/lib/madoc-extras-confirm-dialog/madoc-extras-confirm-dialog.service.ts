import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export class ConfirmDialogParameters {

    constructor(
        public text = '',
        public buttons: string[] = [],
        public title = '',
        public details: string[] = [],
    ) { }

}

@Injectable({
    providedIn: 'root'
})
export class MadocExtrasConfirmDialogService {

    private subject = new Subject<[ConfirmDialogParameters, Observer<string>]>();

    params$ = this.subject.asObservable();

    constructor() { }

    /*
    Apresenta popup de confirmação com botões OK e Cancelar.

    Utilização:

    confirmDialogService.confirm('Confirma a exclusão do item xpto?', 'Título opcional')
      .subscribe(
        (confirmou: boolean) => {
          if(confirmou) {
            // faz o que tem que fazer
          }
        }
      );

    */
    confirm(text: string, title = 'Confirmação'): Observable<boolean> {
        return this.modal(text, undefined, title).pipe(first(), map(b => b === 'OK'));
    }

    /*
    Apresenta popup modal com mensagem e botões.

    Utilização:

    confirmDialogService.modal("Clique em um botâo.", ['Botão 1', 'Botão 2', 'Botão 3'],
      'Título opcional', ['Outra linha opcional'])
      .subscribe(
        (botao: string) => {
          console.log(botao);
        }
      );

    */
    modal(text: string, buttons: string[] = ['OK', 'Cancelar'],
        title = 'Mensagem', details: string[] = []): Observable<string> {
        const params = new ConfirmDialogParameters(text, buttons, title, details);
        const selected = new Subject<string>();
        this.subject.next([params, selected]);
        return selected.pipe(first());
    }

}
