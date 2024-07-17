import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {MadocDispositivoVetoComponent} from "./dispositivo-veto.component";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Veto} from "../veto.model";
import {DescritorDispositivoComponent} from "./descritor-dispositivo.component";
import {Cedula} from "../cedula.model";

describe('MadocDispositivoVetoComponent', () => {
  let component: MadocDispositivoVetoComponent;
  let fixture: ComponentFixture<MadocDispositivoVetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MadocDispositivoVetoComponent, DescritorDispositivoComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        HttpClient,
        HttpHandler,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MadocDispositivoVetoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    let cedula = getCedula();
    component.veto = cedula.vetos[0];
    component.disabled = false;
    fixture.detectChanges();
  });

  describe('Quando o componente é inicializado', () => {
    it('deve instanciar o form', () => {
      expect(component.form).toBeDefined();
    });

    it('deve inicializar com o veto existente', () => {
      expect(component.veto).toBeDefined();
    });

    it('deve inicializar com o veto existente', () => {
      expect(component.veto).toBeDefined();
    });
  });

  describe('Quando há mudanças provocadas no filtro do formulário de veto parcial', () => {
    it('deve iniciar listando todos os vetos', async () => {
      let qtdElementos = fixture.debugElement.queryAll(By.css('input[type="checkbox"]')).length;

      expect(qtdElementos).toBe(3);
    });

    it('deve filtrar um dispositivo ao preencher o campo com um valor textual', async () => {
      typeValue(fixture, 'componentes');
      fixture.detectChanges();

      expect(component.getDispositivosWithFilter().length).toBe(1);
    });

    it('deve filtrar dois dispositivos ao preencher o campo com um valor de faixa de dispositivos', async () => {
      typeValue(fixture, '1-2');
      fixture.detectChanges();

      expect(component.getDispositivosWithFilter().length).toBe(2);
      expect(component.getDispositivosWithFilter()[0].numeroIdentificador).toBe("57.22.001");
      expect(component.getDispositivosWithFilter()[1].numeroIdentificador).toBe("57.22.002");
    });
  });

  describe('Quando não há seleção de dispositivos em veto parcial', () => {
    it('há exibição da label de nenhum item selecionado', () => {
      let label = fixture.debugElement.query(By.css('#itens-selecionados label')).nativeElement;

      expect(label.textContent).toBe('Nenhum Item Selecionado');
      expect(component.getDispositivosSelecionados().length).toBe(0);
    });
  });

  describe('Quando há dispositivos para serem selecionados em veto parcial', () => {
    it('deve selecionar um dispositivo', async () => {
      fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[1].nativeElement.click();
      fixture.detectChanges();

      expect(component.getDispositivosSelecionados().length).toBe(1);
      expect(component.getDispositivosSelecionados()[0].numeroIdentificador).toBe('57.22.002');
    });

    it('deve exibir um dispositivo selecionado', async () => {
      fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[1].nativeElement.click();
      fixture.detectChanges();

      let button = fixture.debugElement.query(By.css('#itens-selecionados button')).nativeElement;

      expect(button.textContent).toContain('57.22.002');
    });

    it('deve exibir dois dispositivos selecionados', async () => {
      fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[0].nativeElement.click();
      fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[2].nativeElement.click();
      fixture.detectChanges();

      let buttons = fixture.debugElement.queryAll(By.css('#itens-selecionados button'));

      expect(buttons[0].nativeElement.textContent).toContain('57.22.001');
      expect(buttons[1].nativeElement.textContent).toContain('57.22.003');
    });
  });

  it('deve exibir remover um item', async () => {
    fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[0].nativeElement.click();
    fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[2].nativeElement.click();
    fixture.detectChanges();

    let buttons = fixture.debugElement.queryAll(By.css('#itens-selecionados button span'));
    buttons[1].nativeElement.click(); // Removendo o segundo dispositivo selecionado
    fixture.detectChanges();

    buttons = fixture.debugElement.queryAll(By.css('#itens-selecionados button'));

    expect(buttons.length).toBe(1);
    expect(buttons[0].nativeElement.textContent).toContain('57.22.001');
  });

  describe('Quando há seleção de veto total', () => {
    it('não deve haver dispositivos para selecionar', async () => {
      let cedula = getCedula();
      let veto = cedula.vetos[0];
      veto.total = true;
      veto.dispositivos = [];
      component.veto = veto;
      fixture.detectChanges();
      let qtdDispositivos = fixture.debugElement.queryAll(By.css('input[type="checkbox"]')).length;

      expect(qtdDispositivos).toBe(0);
    });

    it('deve selecionar todos os dispositivos não prejudicados', async () => {
      component.veto.dispositivos[1].prejudicado = true;
      component.marcarTodosDispositivos(true);
      fixture.detectChanges();

      expect(component.getDispositivosSelecionados().length).toBe(2);
    });
  });

});

export function typeValue(fixture: ComponentFixture<MadocDispositivoVetoComponent>, value: string) {
  const input = fixture.debugElement.query(By.css('#filtro')).nativeElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

export function getCedula(): Cedula {
  return Object.assign(new Cedula(), getJson());
}

export function getJson() {
  return {
    "id":414,
    "versao":1,
    "vetos":[{
      "id": '57.22',
      "total": true,
      "numero": "57",
      "ano": 2022,
      "numeroIdentificador": "57.22",
      "dispositivos": [
        {
          "numeroIdentificador": "57.22.001",
          "texto": "§ 1º do art. 3º",
          "conteudo": "Serão aceitas propostas de inscrições individuais ou de equipes de, no máximo, três componentes.",
          "prejudicado": false
        },
        {
          "numeroIdentificador": "57.22.002",
          "texto": "§ 2º do art. 3º",
          "conteudo": "O proponente deverá registrar, no formulário de inscrição, uma proposta sucinta de projeto de desenvolvimento de solução web que utilize, preferencialmente, dados do Senado Federal com o objetivo de colaborar na compreensão do processo legislativo e da atuação parlamentar pela sociedade.",
          "prejudicado": false
        },
        {
          "numeroIdentificador": "57.22.003",
          "texto": "§ 3º do art. 3º",
          "conteudo": "Todos os proponentes deverão ser identificados no formulário de inscrição, sendo que no caso de inscrição coletiva, além da identificação, deverá ser indicado o membro responsável pela equipe.",
          "prejudicado": false
        },
      ]
    }]
  };
}

