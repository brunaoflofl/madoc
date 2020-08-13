import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { API } from '../model/api.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveDto } from '../model/save-dto';
import { map, take } from 'rxjs/operators';
import { Documento } from '../model/documento';
import { Modelo } from '../model/modelo-dto';
import { MadocService } from '@lexml/madoc-ui';
import isEqual from 'lodash-es/isEqual';
import { removeDiacritics } from '../shared/util/string-util';

@Injectable()
export class DocumentoService {
    private api: API = window.parent['__madoc_opener']['madoc'];

    documento: Documento;
    dirty = false;

    constructor(private madocService: MadocService, private http: HttpClient) {}

    render(modelo: Modelo): void {
        this.madocService.render(modelo);
        this.madocService.changed$.subscribe(
            (state) => (this.documento.estado = state)
        );
        this.documento = this.getDocumento(modelo);
    }

    hasChanged() {
        if (
            this.documento == null ||
            this.documento.estado == null ||
            this.madocService.getState() == null
        ) {
            return false;
        }
        return (
            this.dirty ||
            !isEqual(
                this.madocService.getState().answers,
                this.documento.estado.answers
            )
        );
    }

    getDocumento(modelo: Modelo) {
        return {
            nome: this.api.getNomeDocumento(),
            elaborador: modelo.properties.Elaborador,
            repositorio: {
                uuid: modelo.uuid,
                saveUrl: this.api.getUrlSalvar(),
            },
            tipoDocumento: modelo.properties.TipoModelo.toLocaleLowerCase(),
            modelo: {
                id: modelo.properties.Id,
                nome: modelo.properties.Nome,
            },
        };
    }

    isNew() {
        return this.api.getAcao() === 'novo';
    }

    validate() {
        const errors = this.documento.estado.errors;
        setTimeout(() => {
            this.madocService.focus(errors[0].id);
        }, 1000);

        return errors;
    }

    private buildSaveDto(documento: Documento): SaveDto {
        return {
            uuid: documento.repositorio.uuid,
            name: documento.nome,
            saveUrl: documento.repositorio.saveUrl,
            valido: documento.estado.valid,
            answers: documento.estado.answers,
        };
    }

    abrir() {
        return this.http.get(`/madoc/api/abrir?openUrl=${this.api.getUrlAbrir()}`, {
            responseType: 'json',
        });
    }

    fechar() {
        this.documento = null;
        this.madocService.reset();
        this.api.fechar();
    }

    salvar(): Observable<boolean> {
        return this.http
            .post('/madoc/api/salvar', this.buildSaveDto(this.documento), {
                responseType: 'text',
            })
            .pipe(
                map((resposta) => {
                    if (resposta === 'OK') {
                        this.api.notificaDocumentoSalvo();
                        this.dirty = false;
                        return true;
                    }
                    return false;
                })
            );
    }
}
