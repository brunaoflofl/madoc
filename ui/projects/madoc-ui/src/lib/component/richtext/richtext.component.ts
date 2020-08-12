import { CkeditorConfigService } from '../../service/ckeditorconfig.service';
import { Component, Input, OnInit } from '@angular/core';
import { MadocAbstractComponent } from '../shared/madoc-abstract.component';
import { RichTextQuestion } from '../../model/item/richtext/richtext-question';

@Component({
    selector: 'madoc-richtext',
    template: `
  <div class="component" [ngClass]="{'hidden': !item.visible}" style="margin-bottom: 10px"
  [style.border]="isValid()? 'none' : '1px solid red'">
    <madoc-header [item] = item></madoc-header>

      <ckeditor
        [(ngModel)]="value"
        (change)="onChange($event)"
        [readonly]="isDisabled(item)"
        [config]="myCkeditorConfig"
        (blur)="onModified()"
        debounce="200">
      </ckeditor>
    <madoc-error [item] = item></madoc-error>
  </div>
  `
})
export class MadocRichTextComponent extends MadocAbstractComponent<RichTextQuestion> implements OnInit {
    @Input() item;
    myCkeditorConfig: any;

    constructor(private ckService: CkeditorConfigService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.myCkeditorConfig = this.ckService.getConfig(this.item.inline, this.item.lines);
    }

    getItem() {
        return this.item;
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
