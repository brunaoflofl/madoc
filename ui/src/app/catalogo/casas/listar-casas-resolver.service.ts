import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CatalogoService } from 'src/app/service/catalogo.service';



@Injectable()
export class ListarCasasResolverService implements Resolve<any>  {

  constructor(private catalogoService: CatalogoService) {}

  resolve() {
    return this.catalogoService.getCasas()
      .pipe(catchError((error) => of({error: error})));
  }
}
