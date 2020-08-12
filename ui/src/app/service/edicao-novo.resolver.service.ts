

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CatalogoService } from './catalogo.service';



@Injectable()
export class EdicaoNovoResolverService implements Resolve<any>  {

  constructor(private catalogoService: CatalogoService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const params = snapshot.queryParams;
    return this.catalogoService.getModelo(params['id'])
      .pipe(catchError((error) => of({error: error})));

  }
}
