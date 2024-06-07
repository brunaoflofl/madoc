import { MadocVetoComponent } from './component/veto/veto.component';
import { MadocDispositivoVetoComponent } from './component/veto/dispositivo-veto/dispositivo-veto.component';
import { DescritorDispositivoComponent } from './component/veto/dispositivo-veto/descritor-dispositivo.component';
import { MadocDaterangeComponent } from './component/daterange/daterange.component';
import { CkeditorConfigService } from './service/ckeditorconfig.service';
import { QuestionService } from './service/question.service';
import { MadocService } from './service/madoc.service';
import { HttpService } from './service/http.service';
import { ComponentService } from './service/component.service';
import { ActionService } from './service/action.service';
import { MadocTextListComponent } from './component/textlist/textlist.component';
import { MadocSectionComponent } from './component/section/section.component';
import { MadocRichTextComponent } from './component/richtext/richtext.component';
import { MadocRadioBoxGroupComponent } from './component/radiobox-group/radiobox-group.component';
import { MadocNumberComponent } from './component/number/number.component';
import { MadocMemoTextComponent } from './component/memotext/memotext.component';
import { MadocLoadingComponent } from './component/shared/madoc-loading.component';
import { MadocInputTextComponent } from './component/inputtext/inputtext.component';
import { MadocIndicadorObrigatorioComponent } from './component/shared/madoc-indicador-obrigatorio.component';
import { MadocHintComponent } from './component/shared/madoc-hint.component';
import { MadocHeaderComponent } from './component/shared/madoc-header.component';
import { MadocErrorComponent } from './component/shared/error.component';
import { MadocDateComponent } from './component/date/date.component';
import { MadocChoiceListComponent } from './component/choicelist/choicelist.component';
import { MadocComponent } from './component/shared/madoc.component';
import { MadocComboComponent } from './component/combo/combo.component';
import { MadocConvidadoComponent } from './component/convidado/convidado.component';
import { MadocCheckBoxGroupComponent } from './component/checkbox-group/checkbox-group.component';
import { MadocMateriaComponent } from './component/materia/materia.component';
import { MadocCheckboxComponent } from './component/checkbox/checkbox.component';
import { MadocSignatarioComponent } from './component/signatario/signatario.component';
import { MadocButtonComponent } from './component/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { CKEditorModule } from 'ng2-ckeditor';
import { MadocMultiMateriaComponent } from './component/multimateria/multimateria.component';
import { TextMaskModule } from 'angular2-text-mask';
defineLocale('ptbrlocale', ptBrLocale);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TypeaheadModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CKEditorModule,
        TextMaskModule
    ],
    declarations: [
        MadocSignatarioComponent,
        MadocButtonComponent,
        MadocCheckboxComponent,
        MadocCheckBoxGroupComponent,
        MadocComboComponent,
        MadocConvidadoComponent,
        MadocComponent,
        MadocChoiceListComponent,
        MadocDateComponent,
        MadocDaterangeComponent,
        MadocErrorComponent,
        MadocHeaderComponent,
        MadocHintComponent,
        MadocInputTextComponent,
        MadocIndicadorObrigatorioComponent,
        MadocLoadingComponent,
        MadocMateriaComponent,
        MadocMemoTextComponent,
        MadocNumberComponent,
        MadocRadioBoxGroupComponent,
        MadocRichTextComponent,
        MadocSectionComponent,
        MadocTextListComponent,
        MadocDispositivoVetoComponent,
        DescritorDispositivoComponent,
        MadocVetoComponent,
        MadocMultiMateriaComponent
    ],
    providers: [
        ActionService,
        ComponentService,
        HttpService,
        MadocService,
        QuestionService,
        CkeditorConfigService
    ],
    exports: [MadocComponent]
})
export class MadocModule {
    constructor (@Optional() @SkipSelf() parentModule?: MadocModule) {
        if (parentModule) {
          throw new Error(
            'MadocModule is already loaded. Import it in the AppModule only');
        }
      }
     static forRoot(): ModuleWithProviders<MadocModule> {
      return {
         ngModule: MadocModule,
         providers: [ MadocService, QuestionService, ActionService, HttpService ]
       };
     }
}
