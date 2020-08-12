import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Resolve } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { DocumentoService } from './documento.service';



@Injectable()
export class EdicaoAbrirResolverService implements Resolve<any>  {

  constructor(private documentoService: DocumentoService) {}

  resolve() {
    return this.documentoService.abrir()
      .pipe(catchError((error) => of({error: error})));
  }
}
