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

import {MadocChoiceListComponent} from './choicelist.component';
import {ChoiceListQuestion} from '../../model/item';


describe('MadocChoiceListComponent', () => {
  let service;
  let store;
  let component: MadocChoiceListComponent;
  let fixture: ComponentFixture<MadocChoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MadocChoiceListComponent,
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
    fixture = TestBed.createComponent(MadocChoiceListComponent);
    component = fixture.componentInstance;
    component.item = getItem(service);
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar QuestionService', () => {
      expect(service).toBeDefined();
    });

    it('o valor inicial da answer deve ser vazio quando não houver onLoad', () => {
      expect(component.item.answer).toEqual([]);
    });
  });

  describe('Quando há mudanças provocadas pelo formulário', () => {
    it('deve atualizar dispositivos selecionados ao selecionar um dispositivo disponível', () => {
      selectOption(fixture, '.selectDisponiveis', '.inputLeft', 1);
      expect(component.disponiveisSelecionados).toEqual(['COMISSÃO DE ASSUNTOS ECONÔMICOS']);
    });

    it('deve limpar dispositivos selecionados ao mover o dispositivo para os dispositivos escolhidos', () => {
      moveRight(fixture, 1);

      expect(component.disponiveisSelecionados.length).toBe(0);
    });

    it('deve atualizar dispositivos escolhidos ao selecionar um dispositivo escolhido', () => {
      moveRight(fixture, 1);
      selectOption(fixture, '.selectSelecionados', '.inputRight', 0);

      expect(component.escolhidosSelecionados).toEqual(['COMISSÃO DE ASSUNTOS ECONÔMICOS']);
    });

    it('deve limpar dispositivos escolhidos e a answer ao mover o dispositivo para os dispositivos disponíveis', () => {
      moveRight(fixture, 0);
      moveLeft(fixture, 0);

      expect(component.escolhidosSelecionados.length).toBe(0);
      expect(component.item.answer.length).toBe(0);
    });

    it('deve atualizar a answer com todos dispositivos escolhidos', () => {
      clickButton(fixture, '.glyphicon-forward');
      expect(component.item.answer.length).toBe(4);
    });
  });

  describe('Quando há mudanças provocadas por uma ação externa', () => {
    it('deve manter o valor anterior, se o valor for null', () => {
      component.item.setQuestionValue('COMISSÃO DE ASSUNTOS ECONÔMICOS');
      fixture.detectChanges();

      expect(component.item.answer[0].value).toEqual('COMISSÃO DE ASSUNTOS ECONÔMICOS');
    });

    it('deve esvaziar a answer, se o valor for vazio', () => {
      component.item.setQuestionValue('');
      fixture.detectChanges();

      expect(component.item.answer).toEqual([]);
    });
  });
});

//
// funcões auxiliares
//


export function moveRight(fixture, value) {
  selectOption(fixture, '.selectDisponiveis', '.inputLeft', value);
  clickButton(fixture, '.glyphicon-triangle-right');
}

export function moveLeft(fixture, value) {
  selectOption(fixture, '.selectDisponiveis', '.inputLeft', value);
  clickButton(fixture, '.glyphicon-triangle-left');
}

export function selectOption(fixture, selectCss, optionCss, value) {
  const select = getElement(fixture, selectCss);
  const option = getElementAll(fixture, optionCss)[value].nativeElement;
  select.value = option.value;
  getElement(fixture, selectCss).dispatchEvent(new Event('change'));
  fixture.detectChanges();
}

export function clickButton(fixture, css) {
  const select = getElement(fixture, css);
  select.click();
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
  return service.buildQuestion({
    type: 'ChoiceListQuestion',
    id: 'q-comissoes-participantes',
    display: 'Comissões do Senado',
    enabled: 'true',
    visible: 'true',
    required: 'false',
    sorted: false,
    options: [
      {
        type: 'Option',
        id: 'q-comissoes-sf-opt-_1',
        display: 'CRA - COMISSÃO DE AGRICULTURA E REFORMA AGRÁRIA',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE AGRICULTURA E REFORMA AGRÁRIA',
        selected: false
      },
      {
        type: 'Option',
        id: 'q-comissoes-sf-opt-_2',
        display: 'CAE - COMISSÃO DE ASSUNTOS ECONÔMICOS',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE ASSUNTOS ECONÔMICOS',
        selected: false
      },
      {
        type: 'Option',
        id: 'q-comissoes-sf-opt-_3',
        display: 'CAS - COMISSÃO DE ASSUNTOS SOCIAIS',
        enabled: 'true',
        visible: 'true',
        value: 'COMISSÃO DE ASSUNTOS SOCIAIS',
        selected: false
      },
      {
        type: 'Option',
        id: 'q-comissoes-sf-opt-_4',
        display:
          'CCT - COMISSÃO DE CIÊNCIA, TECNOLOGIA, INOVAÇÃO, COMUNICAÇÃO E INFORMÁTICA',
        enabled: 'true',
        visible: 'true',
        value:
          'COMISSÃO DE CIÊNCIA, TECNOLOGIA, INOVAÇÃO, COMUNICAÇÃO E INFORMÁTICA',
        selected: false
      }
    ]
  });
}
