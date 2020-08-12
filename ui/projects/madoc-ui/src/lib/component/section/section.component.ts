import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { IMadocComponent } from '../shared/madoc-abstract.component';
import { Section } from '../../model/item/section/section';

@Component({
  selector: 'madoc-secao',
  template: `
      <div class="well well-sm" [ngClass]="{'hidden': !item.visible}">
        <div class="component"
             style="font-weight: bold; font-size: 1.2em; font-weight: bold;
                    border-bottom: 1px solid #e3e3e3; padding-bottom: 5px;
                    color: #555;">{{item.display}}
        </div>
        <div style="background-color: white;" #target>
        </div>
      </div>
    `
})
export class MadocSectionComponent implements IMadocComponent {
  @Input()
  public item: Section;
  @Output()
  retorno$ = new EventEmitter();

  @ViewChild('target', { read: ViewContainerRef, static: true })
  public viewContainerRef;

  constructor(private factory: ComponentFactoryResolver) {}

  isDisabled() {
    return !this.item.enabled;
  }
}
