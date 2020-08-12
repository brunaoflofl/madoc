import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observer } from 'rxjs';
import { ConfirmDialogParameters, MadocExtrasConfirmDialogService } from './madoc-extras-confirm-dialog.service';

@Component({
    selector: 'madoc-extras-confirm-dialog',
    templateUrl: './madoc-extras-confirm-dialog.component.html',
    styles: [
        '.modal-body p { text-indent: 0; padding: 10px 0; }'
    ],
})
export class MadocExtrasConfirmDialogComponent {

    params = new ConfirmDialogParameters();

    private selected: string;

    private result: Observer<string>;

    @ViewChild('childModal', { static: true }) childModal: ModalDirective;

    constructor(
        public service: MadocExtrasConfirmDialogService) {

        service.params$.subscribe(
            ([params, result]) => {
                this.params = params;
                this.result = result;
                this.childModal.show();
            }
        );

    }

    onSelect(button: string) {
        this.selected = button;
        this.childModal.hide();
    }

    onCancel() {
        this.childModal.hide();
    }

    onHidden() {
        this.result.next(this.selected);
    }

}
