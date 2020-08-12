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

import {MadocCheckBoxGroupComponent} from './checkbox-group.component';

describe('MadocCheckBoxGroupComponent', () => {
  let service;
  let store;
  let component: MadocCheckBoxGroupComponent;
  let fixture: ComponentFixture<MadocCheckBoxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocCheckBoxGroupComponent,
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
    store = service.getStore(this.getJson());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadocCheckBoxGroupComponent);
    component = fixture.componentInstance;
    // component.item = store.getQuestion('q-insercao-ata');
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar o estado do componente com o valor inicial', () => {
      expect(component.selecionados.length).toBe(2);
    });

    it('deve inicializar a answer com o valor inicial', () => {
      expect(component.item.answer.length).toBe(2);
    });

    it('deve inicializar o componente no formulário com o valor inicial', () => {
      expect(getAttributeValue(getElementAll(fixture, '.inputChecked')[0].nativeElement, 'ng-reflect-model')).toBe('true');
      expect(getAttributeValue(getElementAll(fixture, '.inputChecked')[1].nativeElement, 'ng-reflect-model')).toBe('false');
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      selectValue(fixture, 1);

      expect(component.selecionados).toEqual(['I', 'II', 'III, “b”']);
    });

    it('deve atualizar a answer com valor válido', () => {
      selectValue(fixture, 0);

      expect(component.item.answer).toEqual(['III, “b”']);
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('deve manter o valor anterior, se o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.item.answer.length).toBe(2);
    });

    it('deve manter o valor anterior, se o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.item.answer.length).toBe(2);
    });

    it('deve manter o valor anterior, se o valor for um boolean (inválido)', () => {
      component.item.setQuestionValue(false);
      fixture.detectChanges();

      expect(component.selecionados[0]).toBe('I');
    });

    it('deve limpar o valor anterior, se o valor informado for inválido', () => {
      component.item.setQuestionValue('inexistente');
      fixture.detectChanges();

      expect(component.item.answer.length).toBe(0);
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('I');
      fixture.detectChanges();

      expect(component.selecionados.length).toBe(1);
    });

    it('deve atualizar o estado com o valor informado mesmo não coincidindo minúscula ou maiúscula', () => {
      component.item.setQuestionValue('i');
      fixture.detectChanges();

      expect(component.selecionados.length).toBe(1);
    });

    it('deve atualizar o componente no formulário com o valor informado', () => {
      component.item.setQuestionValue('III, “a”');
      fixture.detectChanges();

      expect(
        getAttributeValue(getElementByIndex(fixture, '.inputChecked', 2), 'ng-reflect-model')
      ).toBe('true');
    });
  });
});

//
// funcões auxiliares
//

export function selectValue(fixture, index) {
  const select = getElementAll(fixture, '.inputChecked')[index].nativeElement;

  select.click();
  fixture.detectChanges();
}

export function getElement(fixture, byCss) {
  return fixture.debugElement.query(By.css(byCss)).nativeElement;
}

export function getElementByIndex(fixture, byCss, index) {
  return fixture.debugElement.queryAll(By.css(byCss))[index].nativeElement;
}

export function getElementAll(fixture, byCss) {
  return fixture.debugElement.queryAll(By.css(byCss));
}

export function getAttributeValue(element, attributeName) {
  return element.attributes.getNamedItem(attributeName).value;
}

//
// Monta objetos necessários aos testes
//

export function getItem(service: QuestionService) {
  return service.buildQuestion({
    type: 'CheckBoxGroupQuestion',
    id: 'q-insercao-ata',
    display: 'Inserção em ata de voto de pesar (art. 218) por falecimento de',
    enabled: 'true',
    visible: 'true',
    required: 'false',
    sorted: false,
    options: [
      {
        type: 'Option',
        id: 'presidenteOuVice',
        display:
          'Pessoa que tenha exercido o cargo de Presidente ou Vice-Presidente da República (art. 218, I)',
        enabled: 'true',
        visible: true,
        value: 'I',
        selected: true,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'exMembroCongresso',
        display: 'Ex-membro do Congresso Nacional (art. 218, II)',
        enabled: 'true',
        visible: 'true',
        value: 'II',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'pessoaSTF',
        display:
          'Pessoa que exerça ou tenha exercido o cargo de Ministro do STF (art. 218, III, “a”)',
        enabled: 'true',
        visible: 'true',
        value: 'III, “a”',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'pessoaTSU',
        display:
          'Pessoa que exerça ou tenha exercido o cargo de Presidente de Tribunal Superior da União (art. 218, III, “b”)',
        enabled: 'true',
        visible: 'true',
        value: 'III, “b”',
        selected: 'true',
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'pessoaTCU',
        display:
          'Pessoa que exerça ou tenha exercido o cargo de Presidente do TCU (art. 218, III, “c”)',
        enabled: 'true',
        visible: 'true',
        value: 'III, “c”',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'pessoaMinistro',
        display:
          'Pessoa que exerça ou tenha exercido o cargo de Ministro de Estado (art. 218, III, “d”)',
        enabled: 'true',
        visible: 'true',
        value: 'III, “d”',
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
    uuid: '',
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
              type: 'CheckBoxGroupQuestion',
              id: 'q-insercao-ata',
              display: 'Inserção em ata de voto de pesar (art. 218) por falecimento de',
              enabled: 'true',
              visible: 'true',
              required: 'false',
              sorted: false,
              options: [
                {
                  type: 'Option',
                  id: 'presidenteOuVice',
                  display:
                    'Pessoa que tenha exercido o cargo de Presidente ou Vice-Presidente da República (art. 218, I)',
                  enabled: 'true',
                  visible: true,
                  value: 'I',
                  selected: true,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'exMembroCongresso',
                  display: 'Ex-membro do Congresso Nacional (art. 218, II)',
                  enabled: 'true',
                  visible: 'true',
                  value: 'II',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'pessoaSTF',
                  display:
                    'Pessoa que exerça ou tenha exercido o cargo de Ministro do STF (art. 218, III, “a”)',
                  enabled: 'true',
                  visible: 'true',
                  value: 'III, “a”',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'pessoaTSU',
                  display:
                    'Pessoa que exerça ou tenha exercido o cargo de Presidente de Tribunal Superior da União (art. 218, III, “b”)',
                  enabled: 'true',
                  visible: 'true',
                  value: 'III, “b”',
                  selected: 'true',
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'pessoaTCU',
                  display:
                    'Pessoa que exerça ou tenha exercido o cargo de Presidente do TCU (art. 218, III, “c”)',
                  enabled: 'true',
                  visible: 'true',
                  value: 'III, “c”',
                  selected: false,
                  input: false,
                  inputType: 'TEXT'
                },
                {
                  type: 'Option',
                  id: 'pessoaMinistro',
                  display:
                    'Pessoa que exerça ou tenha exercido o cargo de Ministro de Estado (art. 218, III, “d”)',
                  enabled: 'true',
                  visible: 'true',
                  value: 'III, “d”',
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
