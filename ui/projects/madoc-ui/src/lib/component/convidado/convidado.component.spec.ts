import { ConvidadoQuestion } from '../../model/item/convidado/convidado-question';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MadocConvidadoComponent } from './convidado.component';

class MockMadocConvidadoComponent extends MadocConvidadoComponent {
  item = getConvidado();
}

describe('MadocConvidadoComponent', () => {
  let component: MockMadocConvidadoComponent;
  let fixture: ComponentFixture<MockMadocConvidadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TypeaheadModule.forRoot()
      ],
      declarations: [MadocConvidadoComponent, MockMadocConvidadoComponent],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockMadocConvidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Testando o estado inicial do componente', () => {
    it('deve instanciar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar a answer com valor vazio', async () => {
      expect(component.item.answer.length).toBe(0);
    });
  });
});

//
// Monta objetos necessários aos testes
//

export function getConvidado() {
  const convidado = new ConvidadoQuestion();
  convidado.build({
    type: 'ConvidadoQuestion',
    id: 'q-convidados',
    display: 'Convidados',
    hint: '\'<html>Liste os nomes dos convidados.</html>\'',
    enabled: 'true',
    visible: 'true',
    required: 'true'
  });
  return convidado;
}
