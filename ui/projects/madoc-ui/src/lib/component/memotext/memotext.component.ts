import {Component, Input, OnInit} from '@angular/core';
import {MadocAbstractComponent} from '../shared/madoc-abstract.component';
import {MemoTextQuestion} from '../../model';

@Component({
  selector: 'madoc-memotext',
  template: `
    <div class="component form-group" [ngClass]="{'hidden': !item.visible}"
         [style.border]="isValid()? 'none' : '1px solid red'">
      <madoc-header [item] = item></madoc-header>
      <textarea class="form-control memoTextQuestion" [class.disabled]="isDisabled(item)" [disabled]="isDisabled(item)"
                autoResize="true"
                [rows]="item.lines" cols="80" [(ngModel)]="value" (change)="onModified()"
                [id]="item.id" [name]="item.id">
      </textarea>
      <madoc-error [item] = item></madoc-error>
    </div>
`,
})
export class MadocMemoTextComponent extends MadocAbstractComponent<MemoTextQuestion> implements OnInit {
  @Input() item: MemoTextQuestion;


  getItem() {
    return this.item;
  }

  ngOnInit() {
    super.ngOnInit();
    this.item.$status.subscribe((status: boolean) => {
      this.active = status;
    });
  }

  onModified() {
    this.item.dirty = true;
    super.onChange();
  }

  isValid() {
    if (!this.item.dirty) {
      return true;
    } else {
      return this.item.isValid();
    }
  }
}
