import { MadocExtrasConfirmDialogService } from './madoc-extras-confirm-dialog/madoc-extras-confirm-dialog.service';
import { MadocExtrasConfirmDialogComponent } from './madoc-extras-confirm-dialog/madoc-extras-confirm-dialog.component';
import {
    NgModule,
    ModuleWithProviders,
    Optional,
    SkipSelf,
} from '@angular/core';
import { MadocExtrasActionButtonComponent } from './madoc-extras-action/madoc-extras-action-button.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MadocExtrasActionService } from './madoc-extras-action/madoc-extras-action.service';
import { MadocExtrasToolbarComponent } from './madoc-extras-toolbar/madoc-extras-toolbar.component';
import { MadocExtrasAlertComponent } from './madoc-extras-alert/madoc-extras-alert.component';
import { MadocExtrasAlertService } from './madoc-extras-alert/madoc-extras-alert.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAppInterceptor as MadocExtrasHttpAppInterceptor } from './madoc-extras-http/madoc-extras-http-app.interceptor';
import { MadocExtrasWorkingComponent } from './madoc-extras-working/madoc-extras-working.component';
import { MadocExtrasErrorPageComponent } from './madoc-extras-error-page/madoc-extras-error-page.component';
import { MadocExtrasWorkingService } from './madoc-extras-working/madoc-extras-working.service';

@NgModule({
    declarations: [
        MadocExtrasActionButtonComponent,
        MadocExtrasAlertComponent,
        MadocExtrasToolbarComponent,
        MadocExtrasWorkingComponent,
        MadocExtrasErrorPageComponent,
        MadocExtrasConfirmDialogComponent
    ],
    imports: [CommonModule, AlertModule.forRoot(), ModalModule.forRoot()],
    providers: [
        MadocExtrasActionService,
        MadocExtrasAlertService,
        MadocExtrasWorkingService,
        MadocExtrasConfirmDialogService,
        MadocExtrasHttpAppInterceptor
    ],
    exports: [
        MadocExtrasActionButtonComponent,
        MadocExtrasAlertComponent,
        MadocExtrasToolbarComponent,
        MadocExtrasWorkingComponent,
        MadocExtrasConfirmDialogComponent,
    ],
})
export class MadocExtrasModule {
    constructor(@Optional() @SkipSelf() parentModule?: MadocExtrasModule) {
        if (parentModule) {
            throw new Error(
                'MadocExtrasModule is already loaded. Import it in the AppModule only'
            );
        }
    }
    static forRoot(): ModuleWithProviders<MadocExtrasModule> {
        return {
            ngModule: MadocExtrasModule,
            providers: [
                MadocExtrasActionService,
                MadocExtrasAlertService,
                MadocExtrasWorkingService,
                MadocExtrasConfirmDialogService,
                MadocExtrasWorkingService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MadocExtrasHttpAppInterceptor,
                    multi: true,
                },
            ],
        };
    }
}
