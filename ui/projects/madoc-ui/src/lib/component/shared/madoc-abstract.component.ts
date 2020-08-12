import { EventEmitter, OnInit, Output, Directive } from '@angular/core';
import { Choice, Question } from '../../model';

export interface IMadocComponent {
    target?;
    isDisabled(option?);
}

@Directive()
export abstract class MadocAbstractComponent<Q extends Question>
    implements IMadocComponent, OnInit {
    @Output() retorno$ = new EventEmitter();
    value: string;
    active = false;

    constructor() { }

    abstract getItem(): Question;

    ngOnInit() {
        const self = this;
        this.getItem().$answer.subscribe(value => {
            if (value !== null) {
                if (Array.isArray(value)) {
                    if (self.value !== value[0]) {
                        self.value = value[0];
                        self.onChange(false);
                    }
                } else {
                    if (self.value !== value) {
                        self.value = value;
                        self.onChange(false);
                    }
                }
            }
        });
    }

    onChange(actions = true) {
        if (this.isModified()) {
            this.getItem().answer = this.value;
            const choice = new Choice(
                this.getItem().id,
                this.getItem().display,
                this.value,
                this.getItem().isValid(),
                actions
            );
            this.retorno$.emit(choice);
        }
    }

    isModified() {
        return this.value != null && this.value !== this.getItem().answer;
    }

    isDisabled(option) {
        return option.enabled !== 'true' && option.enabled !== true;
    }

    defineAlinhamento() {
        if (this.getItem().value != null) {
            return isNaN(parseFloat(this.getItem().value)) ? 'left' : 'right';
        }
        return 'left';
    }
}
