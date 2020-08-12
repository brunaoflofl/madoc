import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { MadocExtrasWorkingService } from '@lexml/madoc-extras';

@Injectable()
export class PdfViewerService {

  // private static resizeHeightFn: () => number;

  private subject = new BehaviorSubject<string>(null);
  file$ = this.subject.asObservable()
    .pipe (
      map(f => {
        if (f) {
            f = 'pdfjs/web/viewer.html?file=' + f;
            return this.dss.bypassSecurityTrustResourceUrl(f);
        }
        return null;
    })
  );

  constructor(private dss: DomSanitizer, private workingService: MadocExtrasWorkingService) { }

  showPdf(file: string) {
    this.workingService.setWorking(true);
    this.subject.next(file);
  }

  hidePdf() {
    this.workingService.setWorking(false);
    this.subject.next(null);
  }

  close() {
    console.log('close');

    this.showPdf(null);
  }

}
