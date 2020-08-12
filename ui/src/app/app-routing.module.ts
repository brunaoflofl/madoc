import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarTiposComponent } from './catalogo/tipos/listar-tipos.component';
import { ListarModelosComponent } from './catalogo/modelos/listar-modelos.component';
import { EditarComponent } from './editar/editar.component';
import { EdicaoAbrirResolverService } from './service/edicao-abrir.resolver.service';
import { AppComponent } from './app.component';
import { EdicaoNovoResolverService } from './service/edicao-novo.resolver.service';
import { ListarModelosResolverService } from './catalogo/modelos/listar-modelos-resolver.service';
import { ListarCasasResolverService } from './catalogo/casas/listar-casas-resolver.service';
import { MadocExtrasErrorPageComponent } from '@lexml/madoc-extras';
import { ListarTiposResolverService } from './catalogo/tipos/listar-tipos-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'tipos',
        component: ListarTiposComponent,
        resolve: { tipos: ListarTiposResolverService }
    },
    {
        path: 'modelos/:tipo',
        component: ListarModelosComponent,
        resolve: { modelos: ListarModelosResolverService, casas: ListarCasasResolverService }
    },
    {
        path: 'abrir',
        component: EditarComponent,
        resolve: { modelo: EdicaoAbrirResolverService }
    },
    {
        path: 'novo',
        component: EditarComponent,
        resolve: { modelo: EdicaoNovoResolverService }
    },
    {
        path: 'erro',
        component: MadocExtrasErrorPageComponent
    }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: 'top'
      }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
