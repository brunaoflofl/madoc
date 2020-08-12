import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MadocExtrasErrorPageService } from '../madoc-extras-error-page/madoc-extras-error-page.service';
import { MadocExtrasWorkingService } from '../madoc-extras-working/madoc-extras-working.service';
import { MadocExtrasError } from './madoc-extras-error';

@Injectable()
export class HttpAppInterceptor implements HttpInterceptor {
    constructor(
        private workingService: MadocExtrasWorkingService,
        private errorPageService: MadocExtrasErrorPageService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const reqClone = req.clone({ withCredentials: true });
        this.workingService.setWorking(true, reqClone);
        return next.handle(reqClone).pipe(
            map((event) => {
                return event;
            }),
            catchError((err: HttpErrorResponse) => {
                return this.tratarErro(err);
            }),
            finalize(() => {
                this.workingService.setWorking(false, reqClone);
            })
        );
    }

    private tratarErro(resp: HttpErrorResponse): Observable<any> {
        const error = new MadocExtrasError();

        error.status = resp.status;
        error.statusText = resp.statusText;
        error.url = resp.url;
        error.message = resp.error;
        error.businessError = false;

        if (resp.status === 404) {
            error.message = `Recurso não encontrado (${error.url})`;
        } else if (resp.status === 400) {
            error.businessError = true;
        } else if (resp.status === 500) {
            error.message = `Erro inesperado`;
        }

        if (!error.businessError) {
            this.errorPageService.showErrorPage(error.message);
        }

        return observableThrowError(error);
    }
}
