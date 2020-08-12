import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, ViewChild, Renderer2, Output } from '@angular/core';
import {Question} from '../../model';

@Component({
  selector: 'madoc-header',
  template: `
  <div #scrollMe >
    <label [ngStyle]="item.hint != null ? {'margin-top': '1em', 'margin-bottom': '0em'} :
                                          {'margin-top': '1em', 'margin-bottom': '0.5em'}">
       {{item.display}}
    </label>
    <madoc-indicador-obrigatorio [item]="item">
    </madoc-indicador-obrigatorio>
    <madoc-hint [item]="item"></madoc-hint>
  </div>
 `,
})
export class MadocHeaderComponent implements AfterViewInit {
  @Input() public item: Question;
  @Output()
  validate = new EventEmitter();

  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;

  constructor( @Inject(ElementRef) private element: ElementRef, public renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    const self = this;
    this.item.onFocus.subscribe(offset => {
      this.item.dirty = true;
      this.validate.emit(true);
      self.myScrollContainer.nativeElement.scrollIntoView({block: 'center', behaviour: 'smooth'});
    });
  }

}
