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

import {MadocNumberComponent} from './number.component';


describe('MadocNumberComponent', () => {
  let service;
  let store;
  let component: MadocNumberComponent;
  let fixture: ComponentFixture<MadocNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        MadocNumberComponent,
        MadocErrorComponent,
        MadocHeaderComponent,
        MadocHintComponent,
        MadocIndicadorObrigatorioComponent
      ],
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
    fixture = TestBed.createComponent(MadocNumberComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Testando estado inicial do componente', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar com valor default', () => {
      expect(component.item.answer).toBe('2018');
    });
  });

  describe('Testando o estado do componente quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      createValue(fixture, '2010');
      component.onModified();
      fixture.detectChanges();
      expect(component.value).toBe('2010');
    });

    it('deve atualizar a answer com valor válido', () => {
      createValue(fixture, '2011');
      component.onModified();
      fixture.detectChanges();
      expect(component.item.answer).toBe('2011');
    });

  });

  describe('Testando estado do componente em resposta a uma ação externa', () => {
    it('não deve atualizar o estado quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.value).toBe('2018');
    });

    it('deve limpar o estado quando o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.value).toBe('');
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(component.value).toBe('texto');
    });

    it('deve atualizar a answer com o valor informado', () => {
      component.item.setQuestionValue('2000');
      fixture.detectChanges();

      expect(component.item.answer).toBe('2000');
    });

    it('deve informar que o valor é inválido', () => {
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
    });

    it('não deve deixar de atualizar o estado mesmo quando o valor for inválido', () => {
      component.item.setQuestionValue('texto inválido');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
      expect(component.value).toBe('texto inválido');
    });
  });

  describe('Testando estado do formulário em resposta a uma ação externa', () => {
      it('não deve atualizar o campo quando o valor for null', () => {
        component.item.setQuestionValue(null);
        fixture.detectChanges();

        expect(getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')).toBe('2018');
      });

      it('deve limpar o campo quando o valor for vazio', () => {
        component.item.setQuestionValue('');
        fixture.detectChanges();

        expect(getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')).toBe('');
      });

      it('deve atualizar o campo com o valor informado', () => {
        component.item.setQuestionValue('texto');
        fixture.detectChanges();

        expect(getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')).toBe('texto');
      });

      it('deve atualizar a answer com o valor informado', () => {
        component.item.setQuestionValue('outro texto');
        fixture.detectChanges();

        expect(getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')).toBe('outro texto');
      });

      it('deve informar que o valor é inválido, quando for um texto e não um número', () => {
        component.item.setQuestionValue('texto');
        fixture.detectChanges();

        expect(getElement(fixture, 'madoc-error').innerText.trim()).toBe('Número informado é inválido');
      });

      it('deve informar que o valor é inválido, quando está fora do range', () => {
        component.item.setQuestionValue(8000);
        fixture.detectChanges();

        expect(getElement(fixture, 'madoc-error').innerText.trim())
        .toBe('Número informado está fora do intervalo permitido: 1980 a 2099');
      });

      it('não deve deixar de atualizar o valor mesmo quando o valor for inválido', () => {
        component.item.setQuestionValue('texto inválido');
        fixture.detectChanges();

        expect(component.item.isValid()).toBe(false);
        expect(getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')).toBe('texto inválido');
      });
  });

});

//
// funcões auxiliares
//

export function createValue(fixture, value) {
  const input = fixture.debugElement.query(By.css('.inputValue')).nativeElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
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


// Monta objetos necessários aos testes
//

export function getItem(service: QuestionService) {
  return service.buildQuestion({
    'type': 'IntegerQuestion',
    'id': 'q-proposicao-ano',
    'display': 'Ano',
    'enabled': 'true',
    'visible': 'true',
    'required': 'false',
    'defaultValue': '2018',
    'maxLength': 4,
    'minValue': 1980,
    'maxValue': 2099,
    'size': 7,
    'onChange': [
      {
        'type': 'SetQuestionValueAction',
        'questionId': 'q-proposicao-ementa',
        'value': ''
      },
      {
        'type': 'SetQuestionValueAction',
        'questionId': 'q-proposicao-apensada',
        'value': ''
      }
    ]
  });
}
