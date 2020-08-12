import {MockContent} from './../shared/store.mock';
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

import {MadocCheckboxComponent} from './checkbox.component';

describe('MadocCheckBoxComponent', () => {
  let service;
  let store;
  let component: MadocCheckboxComponent;
  let fixture: ComponentFixture<MadocCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocCheckboxComponent,
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
    fixture = TestBed.createComponent(MadocCheckboxComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar o estado do componente com o valor inicial', () => {
      expect(component.value).toBeTruthy();
    });

    it('deve inicializar a answer com o valor inicial', () => {
      expect(component.item.answer).toBe(true);
    });

    it('deve inicializar o componente no formulário com o valor inicial', () => {
      expect(getAttributeValue(fixture, '#q-condolencias', 'ng-reflect-model')).toBe('true');
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      selectValue(fixture, false);
      expect(component.value).toBeFalsy();
    });

    it('deve atualizar a answer com valor válido', () => {
      selectValue(fixture, false);
      expect(component.item.answer).toBeFalsy();
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('se o valor for null, o estado do componente é mantido com o valor original', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(getAttributeValue(fixture, '#q-condolencias', 'ng-reflect-model')).toBe('true');
    });

    it('se o valor for vazio, o estado do componente é mantido com o valor original', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(getAttributeValue(fixture, '#q-condolencias', 'ng-reflect-model')).toBe('true');
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue(true);
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    });

    it('deve atualizar a answer com o valor informado', () => {
      component.item.setQuestionValue(false);
      fixture.detectChanges();

      expect(component.value).toBeFalsy();
    });

    it('deve atualizar o componente no formulário com o valor informado', () => {
      component.item.setQuestionValue(false);
      fixture.detectChanges();

      expect(getAttributeValue(fixture, '#q-condolencias', 'ng-reflect-model')).toBe('false');
    });
  });
});

//
// funcões auxiliares
//

export function selectValue(fixture, value) {
  const select = getElement(fixture, '#q-condolencias');
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
    type: 'CheckBoxQuestion',
    id: 'q-condolencias',
    display: 'Apresentação de condolências (art. 221, I)',
    enabled: 'true',
    visible: 'true',
    required: 'false',
    selected: true,
    input: false,
    inputType: 'TEXT',
    onChange: [
      {
        type: 'Switch',
        cases: [
          {
            type: 'Case',
            questionValue: 'true',
            attributeToTest: 'value',
            actions: [
              {
                type: 'SetQuestionValueAction',
                questionId: 'q-incluir-dados-correspondencia',
                value: 'true'
              }
            ]
          }
        ],
        otherwise: [
          {
            type: 'SetQuestionValueAction',
            questionId: 'q-incluir-dados-correspondencia',
            value: 'false'
          }
        ]
      }
    ]
  });
}

export function getJson() {
  return {
    type: 'Document',
    uuid: '5e4e8d49-a233-4544-8cd2-e8073451de12',
    properties: {
      Modelo: 'req-036-sf - Homenagem de Pesar',
      TipoModelo: 'Requerimento',
      Valido: false,
      Elaborador: 'TESTE',
      Nome: 'Desarquivamento de proposição'
    },
    wizard: {
      type: 'Wizard',
      display: 'Requerimento de Pesar',
      pages: [
        {
          type: 'Page',
          id: 'p-detalhes',
          display: 'Requerimento de Homenagem de Pesar',
          enabled: 'true',
          visible: 'true',
          elements: [
            {
              type: 'CheckBoxQuestion',
              id: 'q-condolencias',
              display: 'Apresentação de condolências (art. 221, I)',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              selected: true,
              input: false,
              inputType: 'TEXT',
              onChange: [
                {
                  type: 'Switch',
                  cases: [
                    {
                      type: 'Case',
                      questionValue: 'true',
                      attributeToTest: 'value',
                      actions: [
                        {
                          type: 'SetQuestionValueAction',
                          questionId: 'q-incluir-dados-correspondencia',
                          value: 'true'
                        }
                      ]
                    }
                  ],
                  otherwise: [
                    {
                      type: 'SetQuestionValueAction',
                      questionId: 'q-incluir-dados-correspondencia',
                      value: 'false'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  };
}
