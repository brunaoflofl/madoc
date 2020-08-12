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

import {MadocInputTextComponent} from './inputtext.component';
import {InputTextQuestion} from '../../model/item/inputtext/inputtext-question';


describe('MadocInputTextComponent', () => {
  let service;
  let store;
  let component: MadocInputTextComponent;
  let fixture: ComponentFixture<MadocInputTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocInputTextComponent,
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
    fixture = TestBed.createComponent(MadocInputTextComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar com valor default', () => {
      expect(component.item.answer).toBe('1');
    });

    it('deve inicializar a answer com valor default', () => {
      expect(component.item.answer).toBe('1');
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      createValue(fixture, '20');
      component.onModified();
      fixture.detectChanges();
      expect(component.value).toBe('20');
    });

    it('deve atualizar a answer com valor válido', () => {
      createValue(fixture, '20');
      component.onModified();
      fixture.detectChanges();
      expect(component.item.answer).toBe('20');
    });
  });

  describe('Testando estado do componente em resposta a uma ação externa', () => {
    it('não deve atualizar o estado quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.value).toBe('1');
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
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(component.item.answer).toBe('texto');
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

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('não deve atualizar o campo quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')
      ).toBe('1');
    });

    it('deve limpar o campo quando o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')
      ).toBe('');
    });

    it('deve atualizar o campo com o valor informado', () => {
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')
      ).toBe('texto');
    });

    it('deve atualizar a answer com o valor informado', () => {
      component.item.setQuestionValue('outro texto');
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')
      ).toBe('outro texto');
    });

    it('deve informar que o valor é inválido', () => {
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(getElement(fixture, 'madoc-error').innerText.trim()).toBe(
        'Texto informado inválido'
      );
    });

    it('não deve deixar de atualizar o valor mesmo quando o valor for inválido', () => {
      component.item.setQuestionValue('texto inválido');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
      expect(
        getAttributeValue(fixture, '.inputValue', 'ng-reflect-model')
      ).toBe('texto inválido');
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
  return getElement(fixture, byCss).attributes.getNamedItem(attributeName)
    .value;
}

// Monta objetos necessários aos testes
//

export function getItem(service: QuestionService) {
  return service.buildQuestion({
    type: 'InputTextQuestion',
    id: 'q-proposicao-numero',
    display: 'Número',
    enabled: 'true',
    visible: 'true',
    required: 'false',
    defaultValue: '1',
    regex: '\\d+(?:-?[a-zA-Z]?)?',
    defaultValueSatisfiesRequiredQuestion: true,
    maxLength: 5,
    size: 7,
    onChange: [
      {
        type: 'SetQuestionValueAction',
        questionId: 'q-proposicao-ementa',
        value: ''
      },
      {
        type: 'SetQuestionValueAction',
        questionId: 'q-proposicao-apensada',
        value: ''
      }
    ]
  });
}
