import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Message } from './madoc-extras-alert-message';

@Injectable({
    providedIn: 'root'
})
export class MadocExtrasAlertService {
    private subject = new BehaviorSubject<Message>(null);
    message$ = this.subject.asObservable();

    info(mensagem: string) {
        const msg = {
            type: 'error',
            message: mensagem,
        };
        this.alert(msg);
    }

    success(mensagem: string) {
        const msg = {
            type: 'success',
            message: mensagem,
        };
        this.alert(msg);
    }

    warning(mensagem: string) {
        const msg = {
            type: 'warning',
            message: mensagem,
        };
        this.alert(msg);
    }

    erro(mensagem: string, erro?: Error) {
        const msg = {
            type: 'danger',
            message: mensagem,
            error: erro
        };
        this.alert(msg);
    }

    private alert(message: Message) {
        this.subject.next(message);
    }
}
