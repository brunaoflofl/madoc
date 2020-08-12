import { QuestionService } from './question.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MadocStore } from './store.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { State } from '../model/state';

@Injectable({
    providedIn: 'root',
})
export class MadocService {
    private store: MadocStore;
    private subject = new BehaviorSubject<MadocStore>(null);

    loaded = false;

    store$: Observable<MadocStore> = this.subject
        .asObservable()
        .pipe(filter((s) => s != null));

    changed$: Observable<State>;

    constructor(private questionService: QuestionService) {}

    render(json: any) {
        this.store = this.questionService.getStore(json);
        this.subject.next(this.store);
        this.changed$ = this.store.state$.asObservable().pipe(
            filter((s) => s != null && this.loaded),
            distinctUntilChanged()
        );
    }

    getState() {
        return this.store == null ? null : this.store.getState();
    }

    focus(id: string, offset = 55): void {
        this.store.getQuestion(id).setFocus(offset);
    }

    // todo os métodos abaixo são deprecated
    getDocument(rebuild = false) {
        if (this.store == null) {
            return null;
        }
        return this.store.getDocument(rebuild);
    }

    reset() {
        this.store = undefined;
        this.loaded = false;
        this.subject.next(null);
    }

    isValid() {
        return this.store.isValid();
    }

    isDirty() {
        return this.store != null && this.store.isDirty();
    }

    getInvalidQuestions() {
        return this.store.getInvalidQuestions();
    }
}
