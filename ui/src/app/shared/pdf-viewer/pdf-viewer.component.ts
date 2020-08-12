import { ChangeDetectionStrategy, Component, Input, NgZone } from '@angular/core';

import { PdfViewerService } from './pdf-viewer.service';
import { MadocExtrasWorkingService } from '@lexml/madoc-extras';


@Component({
  selector: 'app-pdf-viewer',
  template: `

  <div #pdf id="pdf" *ngIf="service.file$ | async as file">
    <nav class="navbar navbar-default" style="margin-bottom: 5px; padding: 10px;">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group" role="group" style="float: right;">
          <madoc-extras-action-button [action]="closeAction" style="margin-right: 0;"></madoc-extras-action-button>
        </div>
      </div>
    </nav>
    <div id="pdfViewer">
        <iframe [src]="file" style="width: 100%; height: calc(100vh - 70px);"></iframe>
    </div>
  </div>

  `,
  styleUrls: ['./pdf-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfViewerComponent {

  @Input() closeAction;

  constructor(public workingService: MadocExtrasWorkingService, public service: PdfViewerService, public ngZone: NgZone) {
    window['angularComponentRef'] = { component: this, zone: ngZone };
   }

  pdfPagesLoaded() {
    this.workingService.setWorking(false);
   }
}

function pdfPagesLoaded() {
  window['angularComponentRef'].zone.run( () => window['angularComponentRef'].component.pdfPagesLoaded());
}

// must cast as any to set property on window
const _global = window as any;
_global.pdfPagesLoaded = pdfPagesLoaded;

