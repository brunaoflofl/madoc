import {MockContent} from './../shared/store.mock';
import {ActionService} from './../../service/action.service';
import {HttpService} from './../../service/http.service';
import {QuestionService} from './../../service/question.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MadocIndicadorObrigatorioComponent} from './../shared/madoc-indicador-obrigatorio.component';
import {MadocHintComponent} from './../shared/madoc-hint.component';
import {MadocHeaderComponent} from './../shared/madoc-header.component';
import {MadocErrorComponent} from './../shared/error.component';
import {TextListQuestion} from './../../model/item/textlist/textlist-question';
import {MadocTextListComponent} from './textlist.component';

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {HttpClient, HttpHandler} from '@angular/common/http';


describe('MadocTextListComponent', () => {
  let service;
  let store;
  let component: MadocTextListComponent;
  let fixture: ComponentFixture<MadocTextListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MadocTextListComponent,
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
    store = new MockContent();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadocTextListComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar o estado do componente com undefined', () => {
      expect(component.value).toBeUndefined();
    });

    it('deve inicializar a answer com o valor vazio', () => {
      expect(component.item.answer.length).toBe(0);
    });

    it('deve inicializar o componente no formulário com o valor vazio', () => {
      expect(getElement(fixture, '.inputValue').value).toBe('');
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      typeValue(fixture, 'teste');
      expect(component.value).toBe('teste');
    });

    it('deve limpar o estado do componente depois de adicioná-lo', () => {
      addValue(fixture, 'teste');
      expect(component.value).toBeNull();
    });

    it('deve atualizar a answer', () => {
      addValue(fixture, 'teste');
      expect(component.item.answer[0]).toBe('teste');
    });

  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS SOCIAIS');
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

    it('deve manter o valor anterior, se o valor for null', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS SOCIAIS');
      fixture.detectChanges();
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('COMISSÃO DE ASSUNTOS SOCIAIS');
    });

/*     it('deve limpar a lista, se o valor for vazio', () => {
      component.item.setQuestionValue('teste');
      fixture.detectChanges();
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.item.answer.length).toBe(0);
    }); */

    it('deve atualizar a answer com os valores informados', () => {
      component.item.setQuestionValue(['1', '2']);
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('1');
      expect(component.item.answer[1]).toBe('2');
    });

    it('deve atualizar o formulário com o valor informado', () => {
      component.item.setQuestionValue(['1', '2']);
      fixture.detectChanges();

      expect(getElementAll(fixture, '.optionValue').length).toBe(2);
    });
  });
});


export function typeValue(fixture, value) {
  const input = fixture.debugElement.query(By.css('.inputValue')).nativeElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

export function addValue(fixture, value) {
  const input = fixture.debugElement.query(By.css('.inputValue')).nativeElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  const button = fixture.debugElement.query(By.css('.addValue')).nativeElement;
  button.click();
  fixture.detectChanges();
}

export function getElement(fixture, byCss) {
  return fixture.debugElement.query(By.css(byCss)).nativeElement;
}


export function getElementAll(fixture, byCss) {
  return fixture.debugElement.queryAll(By.css(byCss));
}

//
// Monta objetos necessários aos testes
//

export function getItem(service: QuestionService) {
  return service.buildQuestion(
    {
      type: 'TextListQuestion',
      id: 'q-requerimentos-aditados',
      display: 'Lista de requerimentos aditados',
      enabled: 'true',
      visible: 'true',
      required: 'true'
    }
  );
}

export function getJson() {
  return {
    type: 'Document',
    uuid: '5e4e8d49-a233-4544-8cd2-e8073451de12',
    properties: {
      Modelo: 'req-007-sf - Realização de Audiência Pública',
      TipoModelo: 'Requerimento',
      Valido: false,
      Elaborador: 'TESTE',
      Nome: 'Realização de Audiência Pública'
    },
    wizard: {
      type: 'Wizard',
      display: 'Requerimento de Realização de Audiência Pública',
      pages: [
        {
          type: 'Page',
          id: 'p-detalhes',
          display: 'Requerimento de Realização de Audiência Pública',
          enabled: 'true',
          visible: 'true',
          elements: [
            {
              type: 'Section',
              id: 's-obtem-requerimento',
              display: 'Requerimentos aditados',
              enabled: 'true',
              visible: 'true',
              elements: [
                {
                  type: 'IntegerQuestion',
                  id: 'q-requerimento-ano',
                  display: 'Ano',
                  enabled: 'true',
                  visible: 'true',
                  required: 'false',
                  defaultValue: '2017',
                  maxLength: 4,
                  minValue: 1980,
                  maxValue: 2050,
                  size: 7
                },
                {
                  type: 'Button',
                  id: 'button-obter-requerimento',
                  display: 'Incluir na Lista de requerimentos aditados',
                  enabled: 'true',
                  visible: 'true',
                  onClick: [
                    {
                      type: 'AddQuestionValueAction',
                      questionId: 'q-requerimentos-aditados',
                      value: '{q-requerimento-ano}'
                    }
                  ]
                },
                {
                  type: 'TextListQuestion',
                  id: 'q-requerimentos-aditados',
                  display: 'Lista de requerimentos aditados',
                  enabled: 'true',
                  visible: 'true',
                  required: 'true'
                }
              ]
            }
          ]
        }
      ]
    }
  };
}
