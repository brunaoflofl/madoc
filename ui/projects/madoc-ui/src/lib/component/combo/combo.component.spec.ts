import {MockContent} from './../shared/store.mock';
import {SetQuestionValueAction} from './../../model/actions/set-question-value/set-question-value.action';
import {MadocErrorComponent} from './../shared/error.component';
import {MadocHeaderComponent} from './../shared/madoc-header.component';
import {MadocHintComponent} from './../shared/madoc-hint.component';
import {MadocIndicadorObrigatorioComponent} from './../shared/madoc-indicador-obrigatorio.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {HttpService} from './../../service/http.service';
import {ActionService} from './../../service/action.service';
import {QuestionService} from './../../service/question.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {MadocComboComponent} from './combo.component';
import {ComboQuestion} from '../../model/item/combo/combo-question';

describe('MadocComboComponent', () => {
  let service;
  let store;
  let component: MadocComboComponent;
  let fixture: ComponentFixture<MadocComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocComboComponent,
        MadocErrorComponent,
        MadocHeaderComponent,
        MadocHintComponent,
        MadocIndicadorObrigatorioComponent
      ],
      providers: [QuestionService, ActionService, HttpService, HttpClient, HttpHandler]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(QuestionService);
  });

  beforeEach(() => {
    store = new MockContent();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadocComboComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      selectValue(fixture, 'COMISSÃO DE ASSUNTOS SOCIAIS');
      expect(component.value).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

    it('deve atualizar a answer', () => {
      selectValue(fixture, 'COMISSÃO DE ASSUNTOS SOCIAIS');
      expect(component.item.answer[0].value).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('deve manter o valor anterior, se o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.value).toBe('COMISSÃO DE ASSUNTOS ECONÔMICOS');
    });

    it('deve manter o valor anterior, se o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.value).toBe('COMISSÃO DE ASSUNTOS ECONÔMICOS');
    });

    it('deve manter o valor anterior, se o valor não for encontrado na lista', () => {
      component.item.setQuestionValue('COMISSÃO INEXISTENTE');
      fixture.detectChanges();

      expect(component.value).toBe('COMISSÃO DE ASSUNTOS ECONÔMICOS');
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS SOCIAIS');
      fixture.detectChanges();

      expect(component.value).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

    it('deve atualizar o estado com o valor informado, independente de ser maiúscula ou minúscula', () => {
      component.item.setQuestionValue('Comissão de Assuntos Sociais');
      fixture.detectChanges();

      expect(component.value).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

    it('deve atualizar a answer com o valor informado', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS SOCIAIS');
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

    it('deve atualizar o formulário com o valor informado', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS SOCIAIS');
      fixture.detectChanges();

      expect(getAttributeValue(fixture, '.selectValue', 'ng-reflect-model')).toBe(
        'COMISSÃO DE ASSUNTOS SOCIAIS'
      );
    });
  });
});

//
// funcões auxiliares
//

export function selectValue(fixture, value) {
  const select = getElement(fixture, '.selectValue');
  select.value = value;
  select.dispatchEvent(new Event('change'));

  fixture.detectChanges();
}

export function getElement(fixture, byCss) {
  return fixture.debugElement.query(By.css(byCss)).nativeElement;
}

export function getElementAll(fixture, byCss) {
  return fixture.debugElement.queryAll(By.css(byCss));
}

export function getAttributeValue(fixture, byCss, attributeName) {
  return getElement(fixture, byCss).attributes.getNamedItem(attributeName).value;
}

//
// Monta objetos necessários aos testes
//

export function getItem(service: QuestionService) {
  return service.buildQuestion({
    type: 'ComboQuestion',
    id: 'q-lib-destino-comissao-comissao',
    display: 'Comissão',
    enabled: 'true',
    visible: 'true',
    required: 'true',
    sorted: true,
    onLoad: [
      {
        type: 'SetQuestionValueAction',
        questionId: 'q-lib-destino-comissao-comissao',
        value: 'COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA'
      }
    ],
    onChange: [
      {
        type: 'Switch',
        questionId: 'q-lib-destino',
        cases: [
          {
            type: 'Case',
            questionValue: 'Plenário via Comissão',
            attributeToTest: 'value',
            actions: [
              {
                type: 'SetQuestionValueAction',
                questionId: 'q-lib-autoria-signatario-comissao-nome',
                value: '{q-lib-destino-comissao-comissao}'
              }
            ]
          }
        ]
      }
    ],
    options: [
      {
        type: 'Option',
        id: 'q-lib-destino-comissao-comissao-opt-_2',
        display: 'CAE - COMISSÃO DE ASSUNTOS ECONÔMICOS',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE ASSUNTOS ECONÔMICOS',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-lib-destino-comissao-comissao-opt-_3',
        display: 'CAS - COMISSÃO DE ASSUNTOS SOCIAIS',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE ASSUNTOS SOCIAIS',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-lib-destino-comissao-comissao-opt-_5',
        display: 'CCJ - COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA',
        selected: false,
        input: false,
        inputType: 'TEXT'
      }
    ]
  });
}

export function getJson() {
  return {
    type: 'Document',
    uuid: '5e4e8d49-a233-4544-8cd2-e8073451de12',
    properties: {
      Modelo: 'req-009-sf - Desarquivamento de proposição',
      TipoModelo: 'Requerimento',
      Valido: false,
      Elaborador: 'TESTE',
      Nome: 'Desarquivamento de proposição'
    },
    wizard: {
      type: 'Wizard',
      display: 'Requerimento de Desarquivamento de proposição',
      pages: [
        {
          type: 'Page',
          id: 'p-detalhes',
          display: 'Requerimento de Desarquivamento de proposição',
          enabled: 'true',
          visible: 'true',
          elements: [
            {
              type: 'ComboQuestion',
              id: 'q-lib-destino-comissao-comissao',
              display: 'Comissão',
              enabled: 'true',
              visible: 'true',
              required: 'true',
              sorted: true,
              onLoad: [
                {
                  type: 'SetQuestionValueAction',
                  questionId: 'q-lib-destino-comissao-comissao',
                  value: 'COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA'
                }
              ],
              onChange: [
                {
                  type: 'Switch',
                  questionId: 'q-lib-destino',
                  cases: [
                    {
                      type: 'Case',
                      questionValue: 'Plenário via Comissão',
                      attributeToTest: 'value',
                      actions: [
                        {
                          type: 'SetQuestionValueAction',
                          questionId: 'q-lib-autoria-signatario-comissao-nome',
                          value: '{q-lib-destino-comissao-comissao}'
                        }
                      ]
                    }
                  ]
                }
              ],
              options: [
                {
                  type: 'Option',
                  id: 'q-lib-destino-comissao-comissao-opt-_2',
                  display: 'CAE - COMISSÃO DE ASSUNTOS ECONÔMICOS',
                  enabled: 'true',
                  visible: 'true',
                  value: 'COMISSÃO DE ASSUNTOS ECONÔMICOS',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'q-lib-destino-comissao-comissao-opt-_3',
                  display: 'CAS - COMISSÃO DE ASSUNTOS SOCIAIS',
                  enabled: 'true',
                  visible: 'true',
                  value: 'COMISSÃO DE ASSUNTOS SOCIAIS',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'q-lib-destino-comissao-comissao-opt-_5',
                  display: 'CCJ - COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA',
                  enabled: 'true',
                  visible: 'true',
                  value: 'COMISSÃO DE CONSTITUIÇÃO, JUSTIÇA E CIDADANIA',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                }
              ]
            }
          ]
        }
      ]
    }
  };
}
