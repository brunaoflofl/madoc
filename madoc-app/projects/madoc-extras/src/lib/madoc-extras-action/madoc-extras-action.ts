import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';


export class MadocExtrasAction {
    enabled = true;
    visible = true;

    private subject = new BehaviorSubject<boolean>(false);
    clicked$ = this.subject.asObservable().pipe(filter(c => c));

    constructor(public label: string, public icon?: string, public title = '') {
        this.icon = icon;
    }

    fire() {
        this.subject.next(true);
    }
}
