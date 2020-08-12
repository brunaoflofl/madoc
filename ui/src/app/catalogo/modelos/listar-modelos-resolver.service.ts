import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CatalogoService } from 'src/app/service/catalogo.service';



@Injectable()
export class ListarModelosResolverService implements Resolve<any>  {

  constructor(private catalogoService: CatalogoService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.catalogoService.getModelos(route.params['tipo'])
      .pipe(catchError((error) => of({error: error})));
  }
}
