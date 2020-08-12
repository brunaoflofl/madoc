import { MadocModule } from '@lexml/madoc-ui';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ListarTiposComponent } from './catalogo/tipos/listar-tipos.component';
import { ListarModelosComponent } from './catalogo/modelos/listar-modelos.component';
import { EditarComponent } from './editar/editar.component';
import { TitleComponent } from './title/title.component';
import { MadocExtrasModule } from '@lexml/madoc-extras';
import { DocumentoService } from './service/documento.service';
import { CatalogoService } from './service/catalogo.service';
import { EdicaoAbrirResolverService } from './service/edicao-abrir.resolver.service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { EdicaoNovoResolverService } from './service/edicao-novo.resolver.service';
import { ListarModelosResolverService } from './catalogo/modelos/listar-modelos-resolver.service';
import { ListarCasasResolverService } from './catalogo/casas/listar-casas-resolver.service';
import { PdfViewerComponent } from './shared/pdf-viewer/pdf-viewer.component';
import { PdfViewerService } from './shared/pdf-viewer/pdf-viewer.service';
import { ListarTiposResolverService } from './catalogo/tipos/listar-tipos-resolver.service';

@NgModule({
    declarations: [
        AppComponent,
        EditarComponent,
        ListarModelosComponent,
        ListarTiposComponent,
        TitleComponent,
        PdfViewerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        AppRoutingModule,
        MadocModule.forRoot(),
        MadocExtrasModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [
        CatalogoService,
        DocumentoService,
        EdicaoAbrirResolverService,
        EdicaoNovoResolverService,
        ListarModelosResolverService,
        ListarCasasResolverService,
        ListarTiposResolverService,
        PdfViewerService
    ],
})
export class AppModule { }
