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

import {MadocRadioBoxGroupComponent} from './radiobox-group.component';


describe('MadocRadioBoxGroupComponent', () => {
  let service;
  let store;
  let component: MadocRadioBoxGroupComponent;
  let fixture: ComponentFixture<MadocRadioBoxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot()],
      declarations: [
        MadocRadioBoxGroupComponent,
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
    fixture = TestBed.createComponent(MadocRadioBoxGroupComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('deve inicializar o estado do componente com o valor inicial', () => {
      expect(component.item.attributes.length).toBe(6);
    });

    it('deve inicializar a answer com o valor inicial', () => {
      expect(component.item.answer.length).toBe(1);
    });

    it('deve inicializar o componente no formulário com o valor inicial', () => {
      expect(getElementAll(fixture, '.inputRadioBox')[0].nativeElement.checked).toBe(false);
      expect(getElementAll(fixture, '.inputRadioBox')[5].nativeElement.checked).toBe(true);
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar o estado do componente', () => {
      selectValue(fixture, 0);
      expect(component.item.answer[0].value).toBe('Licença em data específica');
    });

    it('deve atualizar a answer com valor válido', () => {
      selectValue(fixture, 1);

      expect(component.item.answer[0].value).toBe('Licença em data específica a determinar');
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('deve manter o valor anterior, se o valor for null', () => {
      component.item.setQuestionValue(null);
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('Licença a partir de uma data por uma quantidade de dias');
    });

    it('deve manter o valor anterior, se o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('Licença a partir de uma data por uma quantidade de dias');
    });

    it('deve manter o valor anterior, se o valor for um boolean (inválido)', () => {
      component.item.setQuestionValue(false);
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('Licença a partir de uma data por uma quantidade de dias');
    });

    it('deve manter o valor anterior, se o valor informado for inválido', () => {
      component.item.setQuestionValue('inexistente');
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('Licença a partir de uma data por uma quantidade de dias');
    });

    it('deve atualizar o estado com o valor informado', () => {
      component.item.setQuestionValue('Licença em datas específicas');
      fixture.detectChanges();

      expect(component.item.answer[0].value).toBe('Licença em datas específicas');
    });
  });
});

//
// funcões auxiliares
//

export function selectValue(fixture, index) {
  const select = getElementAll(fixture, '.inputRadioBox')[index].nativeElement;
  select.click();

  fixture.detectChanges();
}

export function getElement(fixture, byCss) {
  return fixture.debugElement.query(By.css(byCss)).nativeElement;
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
    type: 'RadioBoxGroupQuestion',
    id: 'q-tipo-datas-licenca',
    display: 'Tipo de especificação de datas da licença',
    enabled: 'true',
    visible: 'true',
    required: 'false',
    sorted: false,
    options: [
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-1',
        display: 'Licença em data específica',
        enabled: 'true',
        visible: 'true',
        value: 'Licença em data específica',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-1a',
        display: 'Licença em data específica a determinar ( ___/___/______ )',
        enabled: 'true',
        visible: 'true',
        value: 'Licença em data específica a determinar',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-2',
        display: 'Licença em datas específicas',
        enabled: 'true',
        visible: 'true',
        value: 'Licença em datas específicas',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-3',
        display: 'Licença em um intervalo de datas',
        enabled: 'true',
        visible: 'true',
        value: 'Licença em um intervalo de datas',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-3a',
        display:
          'Licença em um intervalo de datas a determinar ( ___/___/______ a ___/___/______ )',
        enabled: 'true',
        visible: 'true',
        value: 'Licença em um intervalo de datas a determinar',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-tipo-dataLicenca-4',
        display: 'Licença a partir de uma data por uma quantidade de dias',
        enabled: 'true',
        visible: 'true',
        value: 'Licença a partir de uma data por uma quantidade de dias',
        selected: true,
        input: false,
        inputType: 'TEXT'
      }
    ]
  });
}
