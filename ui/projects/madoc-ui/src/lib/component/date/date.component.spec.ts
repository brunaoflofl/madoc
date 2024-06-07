import {MockContent} from './../shared/store.mock';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MadocErrorComponent} from './../shared/error.component';
import {MadocHeaderComponent} from './../shared/madoc-header.component';
import {MadocHintComponent} from './../shared/madoc-hint.component';
import {MadocIndicadorObrigatorioComponent} from './../shared/madoc-indicador-obrigatorio.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {HttpService} from './../../service/http.service';
import {ActionService} from './../../service/action.service';
import {QuestionService} from './../../service/question.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {MadocDateComponent} from './date.component';
import {DateQuestion} from '../../model/item/date/date-question';

describe('MadocDateComponent', () => {
  let service;
  let store;
  let component: MadocDateComponent;
  let fixture: ComponentFixture<MadocDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot()],
      declarations: [
        MadocDateComponent,
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
        HttpHandler,
        BsLocaleService
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
    fixture = TestBed.createComponent(MadocDateComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    xit('deve inicializar com valor de hoje', () => {
      expect(component.data.toDateString()).toBe(new Date().toDateString());
    });
  });

  xdescribe('Testando estado do componente em resposta a uma ação externa', () => {
    it('não deve atualizar o estado quando o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.data.toDateString()).toBe(new Date().toDateString());
    });

    it('deve informar a data atual quando o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.data.toDateString()).toBe(new Date().toDateString());
    });

    xit('deve informar a data atual quando o valor é inválido', () => {
      component.item.setQuestionValue('texto');
      fixture.detectChanges();

      expect(component.data.toDateString()).toBe(new Date().toDateString());
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('20/08/2018');
      fixture.detectChanges();

      expect(component.data.toDateString()).toBe('Mon Aug 20 2018');
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue(['date', '20/07/2017']);
      fixture.detectChanges();

      expect(component.data.toDateString()).toBe('Thu Jul 20 2017');
    });

    it('deve atualizar a answer com o valor informado', () => {
      component.item.setQuestionValue(['date', '20/07/2017']);
      fixture.detectChanges();

      expect(component.item.answer[0].other).toBe('20/07/2017');
    });
  });

  xdescribe('Quando há mudanças provocadas por uma ação externa', () => {
    it('não deve atualizar o estado quando o valor for null', () => {
      component.item.setQuestionValue(['date', '20/07/2017']);
      fixture.detectChanges();
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(getAttributeValue(fixture, 'input', 'ng-reflect-model')).toBe(
        'Thu Jul 20 2017 00:00:00 GMT-0'
      );
    });

    it('deve atualizar o campo com a data atual quando o valor for vazio', () => {
      component.item.setQuestionValue(['date', '20/07/2017']);
      fixture.detectChanges();
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(getAttributeValue(fixture, 'input', 'ng-reflect-model').substring(0, 15)).toBe(
        new Date().toDateString()
      );
    });

    it('deve atualizar o campo com o valor informado', () => {
      component.item.setQuestionValue(['date', '20/07/2017']);
      fixture.detectChanges();

      expect(getAttributeValue(fixture, 'input', 'ng-reflect-model')).toBe(
        'Thu Jul 20 2017 00:00:00 GMT-0'
      );
    });
  });
});

//
// funcões auxiliares
//

export function createValue(fixture, value) {
  const input = fixture.debugElement.query(By.css('.inputData')).nativeElement;
  input['ng-reflect-model'] = value;

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
    type: 'DateQuestion',
    id: 'q-licenca-data',
    display: 'Dia da Licença',
    enabled: 'true',
    visible: true,
    required: 'true',
    today: true
  });
}
