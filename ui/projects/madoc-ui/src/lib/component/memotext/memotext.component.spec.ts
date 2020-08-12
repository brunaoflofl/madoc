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

import {MadocMemoTextComponent} from './memotext.component';
import {MemoTextQuestion} from '../../model/item/memotext/memotext-question';


describe('MadocMemotextComponent', () => {
  let service;
  let store;
  let component: MadocMemoTextComponent;
  let fixture: ComponentFixture<MadocMemoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocMemoTextComponent,
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
    fixture = TestBed.createComponent(MadocMemoTextComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar o componente com valor default', () => {
      expect(component.value).toBe('teste');
    });

    it('deve inicializar a answer com valor default', () => {
      expect(component.item.answer).toBe('teste');
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      createValue(fixture, '.memoTextQuestion', 'texto qualquer');
      component.onModified();
      fixture.detectChanges();
      expect(component.value).toBe('texto qualquer');
    });

    it('deve atualizar a answer com valor válido', () => {
      createValue(fixture, '.memoTextQuestion', 'texto qualquer');
      component.onModified();
      fixture.detectChanges();
      expect(component.item.answer).toBe('texto qualquer');
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('não deve atualizar o estado quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.value).toBe('teste');
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
      component.item.setQuestionValue('texto qualquer');
      fixture.detectChanges();

      expect(component.item.answer).toBe('texto qualquer');
    });

    it('deve informar que o valor é inválido', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
    });

    it('não deve deixar de atualizar o estado mesmo quando o valor for inválido', () => {
      component.item.setQuestionValue('     ');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
    });

    it('não deve atualizar o campo quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.memoTextQuestion', 'ng-reflect-model')
      ).toBe('teste');
    });

    it('deve limpar o campo quando o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.memoTextQuestion', 'ng-reflect-model')
      ).toBe('');
    });

    it('deve atualizar o componente no formulário com o valor informado', () => {
      component.item.setQuestionValue('outro texto');
      fixture.detectChanges();

      expect(
        getAttributeValue(fixture, '.memoTextQuestion', 'ng-reflect-model')
      ).toBe('outro texto');
    });

    it('não deve deixar de atualizar o componente no formulário mesmo quando o valor for inválido', () => {
      component.item.setQuestionValue('            ');
      fixture.detectChanges();

      expect(component.item.isValid()).toBe(false);
      expect(
        getAttributeValue(fixture, '#q-proposicao-ementa', 'ng-reflect-model')
      ).toBe('            ');
    });

    it('deve informar que o valor é inválido', () => {
      component.item.setQuestionValue('            ');
      fixture.detectChanges();

      expect(getElement(fixture, 'madoc-error').innerText.trim()).toBe(
        'Campo de preenchimento obrigatório'
      );
    });

  });

});

//
// funcões auxiliares
//

export function createValue(fixture, css, value) {
  const input = fixture.debugElement.query(By.css(css)).nativeElement;
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
    type: 'MemoTextQuestion',
    id: 'q-proposicao-ementa',
    display: 'Ementa da Proposição',
    enabled: 'true',
    visible: 'true',
    required: 'true',
    defaultValue: 'teste',
    defaultValueSatisfiesRequiredQuestion: false,
    lines: 5
  });
}
