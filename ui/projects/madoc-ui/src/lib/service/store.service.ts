import { State } from './../model/state';
import { getStatementSemChaves, isSubstituicao } from '../util/parser';

import { IPageItem } from '../model/iPageItem';
import { Section } from '../model/item/section/section';
import { TextListQuestion } from '../model/item/textlist/textlist-question';
import { Question } from '../model/item/question';
import { Wizard } from '../model/wizard';
import { Answer } from '../model/answer';
import { Action } from '../model/actions/action';
import { Choice } from '../model/choice';

import { concat, Observable, BehaviorSubject, interval, Subject } from 'rxjs';
import { isEqual } from 'lodash';

export class MadocStore {
    private map: { [key: string]: Question } = {};
    private originalMap: { [key: string]: any } = {};
    private pageItems: IPageItem[] = [];

    state$ = new BehaviorSubject<State>(null);


    build(wizard: Wizard) {
        this.pageItems = wizard.pageItems;
        this.createMaps();

        this.execute(wizard.onLoadActions);
        this.initComponents();
    }

    getState() {
        const state = new State();
        state.errors = this.getInvalidQuestions().map(q => q.erro);
        state.valid = this.getInvalidQuestions().map(q => q.erro) === [];
        state.answers = {};

        this.buildAnswers(state);

        return state;
    }

    getDocument(rebuild) {
        const doc = {
            type: 'Document',
            dirty: this.isDirty(),
            valido: this.isValid(),
            answers: {}
        };
        this.buildAnswers(doc);
        if (rebuild) {
            window.setTimeout(() => {
                this.originalMap = this.buildMap();
            }, 500);
        }
        return doc;
    }

    private buildAnswers(doc: any) {
        this.getQuestions()
            .filter(i => !(i instanceof Section))
            .map(q => {
                doc.answers[q.id] = [];

                if (Array.isArray(q.answer)) {
                    if (q.answer[0] instanceof Answer) {
                        q.answer.forEach(a => {
                            doc.answers[q.id].push(a.value);
                            if (a.other != null) {
                                doc.answers[q.id].push(a.other);
                            }
                        });
                    } else {
                        doc.answers[q.id] = q.answer;
                    }
                } else if (q.answer != null) {
                    doc.answers[q.id].push(q.answer);
                } else {
                    q.answer != null
                        ? doc.answers[q.id].push(q.answer)
                        : (doc.answers[q.id] = []);
                }
            });
        return doc;
    }

    isDirty() {
        return this.hasChanged();
    }

    isValid() {
        return this.getInvalidQuestions().length === 0;
    }

    getPageItems() {
        return this.pageItems;
    }

    getQuestions() {
        let questions = [];
        this.pageItems.forEach(item =>
            item instanceof Section
                ? (questions = questions.concat(item['questions']))
                : questions.push(item)
        );
        return questions;
    }

    getQuestion(id: string) {
        if (id == null) {
            return null;
        }
        return this.map[id];
    }

    private findParentOfOption(id: string) {
        if (id == null) {
            return null;
        }

        let res = null;
        this.getQuestions().forEach(item => {
            if (Array.isArray(item['attributes'])) {
                item['attributes'].forEach(attr => {
                    if (attr.id === id) {
                        res = item;
                    }
                });
            }
        });
        return res;
    }

    getInvalidQuestions() {
        let questions = [];
        const visiblePageItems = this.pageItems.filter(i => i.visible === true);

        visiblePageItems.forEach(item =>
            item instanceof Section
                ? (questions = questions.concat(item['questions']))
                : questions.push(item)
        );

        return questions.filter(q => q.visible && !q.isValid());
    }

    update(choice: Choice) {
        if (choice.actions) {
            const modified: Question = this.getQuestions().filter(
                q => q.id === choice.id
            )[0];

            const observables = modified.onChangeActions.map(a => a.execute(this));

            concat(...observables).subscribe();
        }
        this.executeAllRules();

        this.state$.next(this.getState());
    }

    execute(actions: Action[]) {
        const observables = actions.map(a => a.execute(this));

        concat(...observables).subscribe();
    }

    setAnswers(answers) {
        this.getQuestions().map(q => {
            if (answers[q.id] != null && answers[q.id].length > 0) {
                q.setQuestionValue(answers[q.id]);
            }
        });
        this.executeAllRules();
        this.originalMap = {};
        window.setTimeout(() => {
            this.originalMap = this.buildMap();
        }, 500);
    }

    addQuestionValue(id: string, value: any) {
        (<TextListQuestion>this.getQuestion(id)).addQuestionValue(
            this.getValue(value)
        );
    }

    setQuestionValue(id: string, value: any) {
        let v = value;

        try {
            v = this.getValue(value);
        } catch (err) {
        }
        this.getQuestion(id).setQuestionValue(v);
    }

    setOptionSelected(id: string) {
        const parent = this.findParentOfOption(id);
        if (parent) {
            parent.setSelected(id);
        }
    }

    public getValue(valor) {
        if (valor == null) {
            return [];
        }

        if (isSubstituicao(valor)) {
            const regex = /{.+?}/;
            let match = null;

            while ((match = regex.exec(valor))) {
                const termo = getStatementSemChaves(match[0]);
                valor = valor.replace(match[0], this.map[termo].getMapValue());
            }
            return valor;
        }

        let _statement: string = valor;

        Object.keys(this.map).map(t => {
            if (
                !(this.map[t] instanceof Section) &&
                this.map[t].getMapValue() != null
            ) {
                // tslint:disable-next-line:no-eval
                const reg =
                    _statement.indexOf('.startsWith') === -1
                        ? eval.call(null, '/' + t + '(\\s)/g')
                        : eval.call(null, '/' + t + '/g');
                _statement = _statement.replace(
                    reg,
                    '\'' + this.map[t].getMapValue() + '\''
                );
            }
        });
        return getStatementSemChaves(_statement);
    }

    private initComponents() {
        this.getQuestions().map(q => this.execute(q.onLoadActions));
        this.executeAllRules();
    }

    private createMaps() {
        window.setTimeout(() => {
            this.originalMap = this.buildMap();
        }, 500);
        if (this.getQuestions() != null) {
            for (const item of this.getQuestions()) {
                if (item != null) {
                    this.map[item.id] = item;
                }
            }
        }
    }

    private executeAllRules() {
        this.pageItems.forEach(i => i.executeRules(this));
    }

    private hasChanged() {
        return !isEqual(this.originalMap, this.buildMap());
    }

    private buildMap(): { [key: string]: string } {
        const m: { [key: string]: string } = {};
        if (this.getQuestions() != null) {
            for (const item of this.getQuestions()) {
                if (item != null) {
                    if (item.answer == null || item.answer === '') {
                        m[item.id] = null;
                    } else if (typeof item.answer === 'string') {
                        m[item.id] = this.htmlDecode(item.answer);
                    } else {
                        m[item.id] = JSON.stringify(
                            item.answer === '' ? null : item.answer
                        );
                    }
                }
            }
        }
        return m;
    }

    private htmlDecode(input) {
        const e = document.createElement('textarea');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    }
}
