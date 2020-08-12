import {Component, Input} from '@angular/core';
import {Question} from '../../model';

@Component({
  selector: 'madoc-error',
  template: `
       <div style="font-size: 0.9em; color: red; clear: left" [ngClass]="{'hidden': isValid()}"><br />{{item.erro.mensagem}}</div>
`,
})
export class MadocErrorComponent {
  @Input() public item: Question;


  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }
}
