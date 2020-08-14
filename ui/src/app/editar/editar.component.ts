import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MadocExtrasActionService } from '@lexml/madoc-extras';
import { MadocExtrasAlertService } from '@lexml/madoc-extras';
import { MadocExtrasConfirmDialogService } from '@lexml/madoc-extras';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DocumentoService } from '../service/documento.service';
import { PdfViewerService } from '../shared/pdf-viewer/pdf-viewer.service';
import { HttpClient } from '@angular/common/http';
import { normalizeFileName } from '../shared/util/file-util';

@Component({
    selector: 'app-madoc-editar',
    templateUrl: 'editar.component.html',
    providers: [DocumentoService, MadocExtrasActionService],
})
export class EditarComponent implements OnInit, AfterViewInit, OnDestroy {
    loaded = false;
    subscriptions = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public actionService: MadocExtrasActionService,
        private alertService: MadocExtrasAlertService,
        public documentoService: DocumentoService,
        public confirm: MadocExtrasConfirmDialogService,
        private visualizarService: PdfViewerService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.initActions();

        this.route.data.pipe(take(1)).subscribe((data) => {
            if (data.modelo.error) {
                this.alertService.erro(
                    'Erro inesperado ao recuperar modelo',
                    data.modelo.error.message
                );
            } else {
                this.documentoService.render(data.modelo);
            }
        });
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    initActions() {
        this.subscriptions.add(
            this.actionService.ACTION_VISUALIZAR.clicked$.subscribe(() => {
                this.visualiza();
            })
        );

        this.subscriptions.add(
            this.actionService.ACTION_FECHAR_VSUALIZACAO.clicked$.subscribe(() => {
                this.closePDF();
            })
        );

        if (this.documentoService.isNew()) {
            this.subscriptions.add(
                this.actionService.ACTION_VOLTAR.clicked$.subscribe(() => {
                    this.volta();
                })
            );
        } else {
            this.actionService.ACTION_VOLTAR.visible = false;
        }

        this.subscriptions.add(
            this.actionService.ACTION_SALVAR_DOCUMENTO.clicked$.subscribe(
                () => {
                    this.salva();
                }
            )
        );
        this.subscriptions.add(
            this.actionService.ACTION_FECHAR_EDICAO.clicked$.subscribe(() => {
                if (!this.documentoService.hasChanged()) {
                    this.fecha();
                } else {
                    this.confirm.modal('Deseja salvar o documento antes de fechar?',
                        ['Sim', 'Não', 'Cancelar'], 'Fechar').subscribe(
                            (button: string) => {
                                if (button === 'Sim') {
                                    this.salva();
                                    this.fecha();
                                } else if (button === 'Não') {
                                    this.fecha();
                                }
                            }
                        );
                }
            })
        );
    }

    volta() {
        this.router.navigate([`/modelos/${this.documentoService.documento.tipoDocumento}`]);
    }

    fecha() {
        this.documentoService.fechar();
    }

    visualiza() {
        const doc = {};
        doc['uuid'] = this.documentoService.documento.repositorio.uuid;
        doc['name'] = this.documentoService.documento.nome;
        doc['valido'] = this.documentoService.documento.estado.valid;
        doc['answers'] = this.documentoService.documento.estado.answers;

        return this.http
            .post('api/gerarpdf', doc, { responseType: 'text' })
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.visualizarService.showPdf(
                        'api/getpdf/' + response + '/' + encodeURIComponent(normalizeFileName(doc['name']))
                    );
                },
                (error) =>
                this.alertService.erro(
                    'Ocorreu um erro inesperado na visdualização do documento', error
                )
            );
    }

    closePDF() {
        this.visualizarService.hidePdf();
        this.actionService.ACTION_FECHAR_EDICAO.enabled = false;
        setTimeout(() => {
          this.actionService.ACTION_FECHAR_EDICAO.enabled = true;
        }, 2000);
      }

    salva() {
        this.documentoService.salvar().subscribe(
            (ok) => {
                if (ok) {
                    this.alertService.success('Documento salvo');
                    const erros = this.documentoService.validate();
                    erros.map((error) => this.alertService.erro(error.display + ': ' + error.mensagem));
                } else {
                    this.alertService.erro(
                        'Erro inesperado. Não foi possível salvar o documento'
                    );
                }
            },
            (error) =>
                this.alertService.erro(
                    'Erro inesperado. Não foi possível salvar o documento'
                )
        );
    }
}
