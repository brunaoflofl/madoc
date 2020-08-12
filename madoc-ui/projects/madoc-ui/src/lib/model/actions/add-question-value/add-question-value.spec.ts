import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MadocButtonComponent} from './../../../component/button/button.component';
import {HttpService} from './../../../service/http.service';
import {ActionService} from './../../../service/action.service';
import {QuestionService} from './../../../service/question.service';
import {AddQuestionValueAction} from './add-question-value.action';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Action} from '../action';
import {HttpClient, HttpHandler} from '@angular/common/http';

class MockContent {
  actions;
  execute(actions: Action[]) {
    this.actions = actions[0];
  }
  get() {
    return this.actions;
  }
}

describe('AddQuestionValueAction', () => {
  let service;
  let store: MockContent;
  let component: MadocButtonComponent;
  let fixture: ComponentFixture<MadocButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MadocButtonComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
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
    fixture = TestBed.createComponent(MadocButtonComponent);
    component = fixture.componentInstance;
    component.item = getButton(service);
    fixture.detectChanges();
    component.retorno$.subscribe(actions => {
      store.execute(actions);
    });
  });

  it('deve instanciar QuestionService', () => {
    expect(service).toBeDefined();
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeDefined();
  });

  it('deve chamar o execute do store e passar as actions', () => {
    const spy = spyOn(store, 'execute').and.callThrough();

    const el = fixture.debugElement.query(By.css('.btn')).nativeElement;
    el.click();
    fixture.detectChanges();

    expect(store.execute).toHaveBeenCalledWith(component.item.actions);
  });

});

//
// Monta objetos necessários aos testes
//

export function getButton(service: QuestionService) {
  return service.buildQuestion({
    'type': 'Button',
    'id': 'button-atualiza',
    'display': 'Atualizar',
    'enabled': 'true',
    'visible': 'true',
    'onClick': [
        {
        'type': 'AddQuestionValueAction',
        'questionId': 'q-destino',
        'value': 'ok'
        }
    ]
   });
}
