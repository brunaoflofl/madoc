import { ConsumeRestServiceAction } from './../../model/actions/consume-rest-service.action';
import { ConsumeSetQuestionValueAction } from './../../model/actions/consume-set-question/consume-set-question-value.action';
import { ActionService } from './../../service/action.service';
import { HttpService } from './../../service/http.service';
import { QuestionService } from './../../service/question.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MadocIndicadorObrigatorioComponent } from './../shared/madoc-indicador-obrigatorio.component';
import { MadocHintComponent } from './../shared/madoc-hint.component';
import { MadocHeaderComponent } from './../shared/madoc-header.component';
import { MadocErrorComponent } from './../shared/error.component';
import { Button } from './../../model/item';
import { MadocButtonComponent } from './button.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('MadocButtonComponent', () => {
  let service;
  let store;
  let component: MadocButtonComponent;
  let fixture: ComponentFixture<MadocButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MadocButtonComponent,
        MadocErrorComponent,
        MadocHeaderComponent,
        MadocHintComponent,
        MadocIndicadorObrigatorioComponent
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        QuestionService,
        ActionService,
        HttpService,
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(QuestionService);
  });

  beforeEach(() => {
    store = service.getStore(this.getJson());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadocButtonComponent);
    component = fixture.componentInstance;
    component.item = store.getQuestion('button-obter-ementa');
    fixture.detectChanges();
    component.retorno$.subscribe(actions => {
      store.execute(actions);
    });
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Quando o botão é acionado deve executar as actions', () => {
    it('deve executar as actions', () => {
      const spy = spyOn(component.item.actions[0], 'execute');
      component.item.actions.forEach(a => a.execute(store));

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});

export function fireButton(fixture) {
  const el = fixture.debugElement.query(By.css('.btn')).nativeElement;

  el.click();
  fixture.detectChanges();
}

//
// Monta objetos necessários aos testes
//

export const xml =
  // tslint:disable-next-line:quotemark
  " <DetalheMateria xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
  // tslint:disable-next-line:quotemark
  " xsi:noNamespaceSchemaLocation='http://legis.senado.leg.br/dadosabertos/dados/DetalheMateriav5.xsd'> " +
  ' <Materia> ' +
  ' <DadosBasicosMateria> ' +
  ' <EmentaMateria>Altera a Lei no 11.445, de 5 de janeiro de 2007, que estabelece as diretrizes nacionais ' +
  ' para o saneamento básico, para dispor sobre o Certificado de Recebíveis de Saneamento (CRS).</EmentaMateria> ' +
  '  </DadosBasicosMateria> ' +
  '  <Autoria> ' +
  '  <Autor> ' +
  '  <NomeAutor>Roberto Muniz</NomeAutor> ' +
  '  <IdentificacaoParlamentar> ' +
  '  <FormaTratamento>Senador</FormaTratamento> ' +
  '  </IdentificacaoParlamentar> ' +
  '  </Autor> ' +
  '  </Autoria> ' +
  '  <Servico> ' +
  '  <NomeServico>RelatoriaMateria</NomeServico> ' +
  '  <UrlServico>http://legis.senado.leg.br/dadosabertos/materia/relatorias/132117?v=5</UrlServico>   ' +
  '  </Servico> ' +
  '  </Materia> ' +
  '  </DetalheMateria>';

export function getJson() {
  return {
    type: 'Document',
    uuid: '5e4e8d49-a233-4544-8cd2-e8073451de12',
    properties: {
      Modelo:
        'req-032-sf - Dispensa de audiência pública para instruir matéria',
      TipoModelo: 'Requerimento',
      Valido: false,
      Elaborador: 'TESTE',
      Nome: 'Realização de Audiência Pública'
    },
    wizard: {
      type: 'Wizard',
      display:
        'Requerimento de Dispensa de audiência pública para instruir matéria',
      pages: [
        {
          type: 'Page',
          id: 'p-detalhes',
          display:
            'Requerimento de Dispensa de audiência pública para instruir matéria',
          enabled: 'true',
          visible: 'true',
          elements: [
            {
              type: 'Button',
              id: 'button-obter-ementa',
              display: 'Obter ementa e informações complementares',
              enabled: 'true',
              visible: 'true',
              onClick: [
                {
                  type: 'ConsumeRestServiceAction',
                  uri:
                    // tslint:disable-next-line:max-line-length
                    'nocache:http://legis.senado.gov.br/dadosabertos/materia/{q-proposicao-tipo}/{q-proposicao-numero}/{q-proposicao-ano}?v=5',
                  transformations: [],
                  actions: [
                    {
                      type: 'ConsumeSetQuestionValueAction',
                      questionId: 'q-nome-autoria-proposicao',
                      xpath: '//Autoria[1]/Autor[1]//NomeAutor/text()'
                    },
                    {
                      type: 'ConsumeSetQuestionValueAction',
                      questionId: 'q-url-servico-relatoria',
                      // tslint:disable-next-line:quotemark
                      xpath:
                        '//Servico[NomeServico=\'RelatoriaMateria\']/UrlServico/text()'
                    }
                  ]
                },
                {
                  type: 'ConsumeRestServiceAction',
                  uri: '{q-url-servico-relatoria}',
                  transformations: [],
                  actions: [
                    {
                      type: 'ConsumeSetQuestionValueAction',
                      questionId: 'q-relator-proposicao',
                      xpath:
                        '//RelatoriaAtual/Relator[1]/IdentificacaoParlamentar/NomeParlamentar/text()'
                    }
                  ]
                }
              ]
            },
            {
              type: 'InputTextQuestion',
              id: 'q-nome-autoria-proposicao',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              maxLength: 5,
              size: 7
            },
            {
              type: 'InputTextQuestion',
              id: 'q-proposicao-tipo',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              defaultValue: 'PLS',
              maxLength: 5,
              size: 7
            },
            {
              type: 'InputTextQuestion',
              id: 'q-proposicao-numero',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              defaultValue: '1',
              maxLength: 5,
              size: 7
            },
            {
              type: 'InputTextQuestion',
              id: 'q-proposicao-ano',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              defaultValue: '2018',
              maxLength: 5,
              size: 7
            },
            {
              type: 'InputTextQuestion',
              id: 'q-url-servico-relatoria',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              maxLength: 5,
              size: 7
            },
            {
              type: 'InputTextQuestion',
              id: 'q-relator-proposicao',
              display: 'Número',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              maxLength: 5,
              size: 7
            }
          ]
        }
      ]
    }
  };
}
