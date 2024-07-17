import {SignatarioQuestion} from '../../model/item/signatario/signatario-question';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {MadocSignatarioComponent} from './signatario.component';

class MockMadocSignatarioComponent extends MadocSignatarioComponent {
  item = getAutor();
}

// TODO FALTA TESTAR testar  a answer

describe('MadocSignatarioComponent', () => {
  let component: MockMadocSignatarioComponent;
  let fixture: ComponentFixture<MockMadocSignatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TypeaheadModule.forRoot()
      ],
      declarations: [MadocSignatarioComponent, MockMadocSignatarioComponent],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockMadocSignatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Testando o estado inicial do componente', () => {

    it('deve instanciar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve possuir dois parlamentares na lista original', () => {
      expect(component.item.attributes.length).toBe(2);
    });

    it('não deve vir selecionado o primeiro parlamentar da lista original', () => {
      expect(component.item.attributes[0].selected).toBe(false);
    });

    it('deve vir selecionado o segundo parlamentar da lista original', async () => {
      expect(component.item.attributes[1].selected).toBe(true);
    });

    it('deve inicializar a interface com um autor e cargo vazios', () => {
      const nome = fixture.debugElement.query(By.css('.inputAuthor')).nativeElement;
      const cargo = fixture.debugElement.query(By.css('.inputCargo')).nativeElement;

      expect(nome.attributes.getNamedItem('ng-reflect-model').value).toBe('');
      expect(cargo.attributes.getNamedItem('ng-reflect-model').value).toBe('');
    });

    it('deve inicializar a answer com valor vazio', async () => {
      expect(component.item.answer.length).toBe(0);
    });

  });


  describe('Testando estado dos campos em resposta a uma ação externa', () => {

    it('deve atualizar o input de parlamentar com o nome informado', () => {
      component.item.setQuestionValue('s4981');
      fixture.detectChanges();

      const nome = fixture.debugElement.query(By.css('#s4981')).nativeElement;
      const cargo = fixture.debugElement.query(By.css('.inputCargo')).nativeElement;

      expect(nome.attributes.getNamedItem('ng-reflect-model').value).toBe('Acir Gurgacz');
      expect(cargo.attributes.getNamedItem('ng-reflect-model').value).toBe('');
    });

    it('deve possuir apenas um input de parlamentar com o autor informado', () => {
      component.item.setQuestionValue('s4981');
      fixture.detectChanges();

      const nome = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(nome.length).toBe(1);
    });

    it('deve atualizar o input de cargo quando este for informado', () => {
      component.item.setQuestionValue(['s4981', 'presidente...']);
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.inputCargo')).nativeElement;

      expect(el.attributes.getNamedItem('ng-reflect-model').value).toBe('presidente...');
    });

    it('deve atualizar os inputs de parlamentar, na ordem correta', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      const el = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(el.length).toBe(2);
      expect(el[0].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('Aécio Neves');
    });

    it('deve atualizar a answer nomes e cargos dos parlamentares, na ordem correta', async () => {
      component.item.setQuestionValue(['s391', 'a', 's4981', 'b']);
      fixture.detectChanges();

      expect(component.item.answer.length).toBe(4);
      expect(component.item.answer[0]).toBe('s391');
      expect(component.item.answer[1]).toBe('a');
      expect(component.item.answer[2]).toBe('s4981');
      expect(component.item.answer[3]).toBe('b');
    });

  });


  describe('Testando botão e a ação de incluir', () => {

    it('deve estar desabilitado o botão de incluir quando não houver autor', () => {
      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar desabilitado o botão de incluir quando o autor atualizado por uma ação externa for inválido', () => {
      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;

      component.item.setQuestionValue('inválido');
      fixture.detectChanges();

      expect(el.disabled).toBe(true);
    });

    it('deve estar habilitado o botão de incluir quando o autor atualizado por uma ação externa for válido', () => {
      component.item.setQuestionValue('s391');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;

      expect(el.disabled).toBe(false);
    });

    it('deve estar desabilitado o botão de incluir quando o autor informado no formulário for inválido', () => {
      component.parlamentares[0] = {id: 'inválido', nome: 'inválido', cargo: ''};
      component.updateAnswer();
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;
      expect(el.disabled).toBe(true);
    });

    it('deve estar habilitado o botão de incluir quando o autor informado no formulário for válido', () => {
      component.parlamentares[0] = {id: 's391', nome: 'Aécio Neves', cargo: ''};
      component.updateAnswer();
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;

      expect(el.disabled).toBe(false);
    });

    it('deve incluir uma linha vazia abaixo e atualizar a answer', () => {
      component.item.setQuestionValue('s391');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('#addAuthor'))
        .nativeElement;

      el.click();
      fixture.detectChanges();

      const el2 = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(el2[0].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('Aécio Neves');
      expect(el2[1].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('');

      expect(component.item.answer.length).toBe(2);
      expect(component.item.answer[0]).toBe('s391');
      expect(component.item.answer[1]).toBe('');
    });

  });

  describe('Testando botão e a ação de mover para baixo', () => {

    it('deve estar desabilitado quando não tem autor', () => {
      const el = fixture.debugElement.query(By.css('.moveDown'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

     it('deve estar desabilitado quando só tem um autor', () => {
      component.item.setQuestionValue('s391');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.moveDown'))
      .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar habilitado quando forem dois autores', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      const el = fixture.debugElement.queryAll(By.css('.moveDown'))[0]
      .nativeElement;

      expect(el.disabled).toBe(false);
    });

    it('deve estar desabilitado quando forem dois autores', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      const el = fixture.debugElement.queryAll(By.css('.moveDown'))[1]
      .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve mover o primeiro autor para a segunda posição', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('.moveDown'))[0].nativeElement
        .click();
      fixture.detectChanges();

      const el2 = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(el2[0].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('Acir Gurgacz');
    });

    it('deve atualizar a answer após mover o primeiro para baixo', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('.moveDown'))[0].nativeElement
        .click();
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('s4981');
      expect(component.item.answer[1]).toBe('');
    });

  });

  describe('Testando o botão e a ação de mover para cima', () => {

    it('deve estar desabilitado quando não tem autor', () => {
      const el = fixture.debugElement.query(By.css('.moveUp'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar desabilitado quando só tem um autor', () => {
      component.item.setQuestionValue('s391');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.moveUp'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar desabilitado quando for o primeiro', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      const el = fixture.debugElement.queryAll(By.css('.moveUp'))[0]
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar habilitado quando for o segundo', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      const el = fixture.debugElement.queryAll(By.css('.moveUp'))[1]
        .nativeElement;

      expect(el.disabled).toBe(false);
    });

    it('deve mover o segundo autor para a primeira posição', () => {
      const debugElement = fixture.debugElement;

      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      debugElement
        .queryAll(By.css('.moveUp'))[1].nativeElement
        .click();
      fixture.detectChanges();

      const el2 = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(el2[0].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('Acir Gurgacz');
    });

    it('deve atualizar a answer após mover o segundo para cima', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('.moveUp'))[1].nativeElement
        .click();
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('s4981');
      expect(component.item.answer[1]).toBe('');
    });

  });

  describe('Testando estado do botão de excluir', () => {

    it('deve estar desabilitado quando não tem autor', () => {
      const el = fixture.debugElement.query(By.css('.deleteAuthor'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve estar desabilitado quando tem apenas um autor', () => {
      component.item.setQuestionValue('s391');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.deleteAuthor'))
        .nativeElement;

      expect(el.disabled).toBe(true);
    });

    it('deve excluir quando clicado no botão correspondente', () => {
      const debugElement = fixture.debugElement;

      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      debugElement
        .queryAll(By.css('.deleteAuthor'))[0].nativeElement
        .click();
      fixture.detectChanges();

      const el2 = fixture.debugElement.queryAll(By.css('.inputAuthor'));

      expect(el2.length).toBe(1);
      expect(el2[0].nativeElement.attributes.getNamedItem('ng-reflect-model').value).toBe('Acir Gurgacz');
    });

    it('deve atualizar a answer após excluir o primeiro', () => {
      component.item.setQuestionValue(['s391', '', 's4981', '']);
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('.deleteAuthor'))[0].nativeElement
        .click();
      fixture.detectChanges();

      expect(component.item.answer[0]).toBe('s4981');
      expect(component.item.answer[1]).toBe('');
    });

  });

});

//
// Monta objetos necessários aos testes
//

export function getAutor() {
  const autor = new SignatarioQuestion();
  autor.build({
    type: 'AutoriaQuestion',
    id: 'q-lib-autoria-signatario-senador-nome',
    display: 'Autoria',
    hint: 'ex: Presidente da Comissão ..., Líder do ...',
    enabled: 'true',
    visible: 'true',
    required: 'true',
    sorted: true,
    options: [
      {
        type: 'Option',
        id: 'q-lib-autoria-signatario-senador-nome-opt_32',
        display: 'Acir Gurgacz',
        enabled: 'true',
        visible: 'true',
        value: 's4981',
        selected: false,
        input: false,
        inputType: 'TEXT'
      },
      {
        type: 'Option',
        id: 'q-lib-autoria-signatario-senador-nome-opt_21',
        display: 'Aécio Neves',
        enabled: 'true',
        visible: 'true',
        value: 's391',
        selected: true,
        input: false,
        inputType: 'TEXT'
      }
    ]
  });
  return autor;
}
