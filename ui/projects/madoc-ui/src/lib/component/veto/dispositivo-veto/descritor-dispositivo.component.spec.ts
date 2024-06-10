import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {DescritorDispositivoComponent} from "./descritor-dispositivo.component";
import {Dispositivo} from "../veto.model";

describe('DescritorDispositivoComponent', () => {

  let component: DescritorDispositivoComponent;
  let fixture: ComponentFixture<DescritorDispositivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DescritorDispositivoComponent],
      providers: [DescritorDispositivoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescritorDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Quando inicializar o componente', () => {
    it('deveria instanciar DescritorDispositivoComponent', () => {
      expect(component).toBeDefined();
    });

    it('deveria inicializar o estado do componente com undefined', () => {
      expect(component.dispostivos).toBeUndefined();
      expect(component.numeroVeto).toBeUndefined();
      expect(component.anoVeto).toBeUndefined();
    });
  });

  describe('Quando houver um dispositivo selecionado', () => {
    it('deveria descrever um dispositivo', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;

      let dispositivo: Dispositivo = criarNovoDispositivo('001');
      component.dispostivos = [dispositivo];

      expect(component.descreverDispositivos()).toBe('dispositivo 1 do Veto 1/2024.');
    });
  });

  describe('Quando houver dois ou mais dispositivos selecionados', () => {
    it('deveria descrever dois dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      let dispositivo1: Dispositivo = criarNovoDispositivo('003');
      let dispositivo2: Dispositivo = criarNovoDispositivo('004');

      component.dispostivos = [dispositivo1, dispositivo2];
      expect(component.descreverDispositivos()).toBe('dispositivos 3 e 4 do Veto 1/2024.');
    });

    it('deveria descrever tres dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('005')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 a 5 do Veto 1/2024.');
    });

    it('deveria descrever dois dispositivos nao sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('005')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 e 5 do Veto 1/2024.');
    });

    it('deveria descrever dois dispositivos nao sequenciais distantes', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('0015')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 e 15 do Veto 1/2024.');
    });

    it('deveria descrever tres dispositivos nao sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('007')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3, 5 e 7 do Veto 1/2024.');
    });

    it('deveria descrever tres dispositivos sequenciais e dois nao sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('007'),
        criarNovoDispositivo('009')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 a 5, 7 e 9 do Veto 1/2024.');
    });

    it('deveria descrever dois dispositivos nao sequenciais e tres dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('007'),
        criarNovoDispositivo('008'),
        criarNovoDispositivo('009')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3, 5 e 7 a 9 do Veto 1/2024.');
    });
  });

  describe('Quando houver dois grupos de dois dispositivos sequenciais selecionados', () => {
    it('deveria descrever dois grupos de tres dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('008'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 a 5 e 8 a 10 do Veto 1/2024.');
    });

    it('deveria descrever dois grupos de tres dispositivos sequenciais, com dispositivos nao sequenciais entre eles', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('001'),
        criarNovoDispositivo('002'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('007'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010'),
        criarNovoDispositivo('0011')];

      expect(component.descreverDispositivos()).toBe('dispositivos 1 e 2, 5, 7 e 9 a 11 do Veto 1/2024.');
    });

    it('deveria descrever dois grupos de dois dispositivos sequenciais, com dispositivos nao sequenciais entre eles e dois artigos no final', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('001'),
        criarNovoDispositivo('002'),
        criarNovoDispositivo('003'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('007'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010')];

      expect(component.descreverDispositivos()).toBe('dispositivos 1 a 3, 5, 7, 9 e 10 do Veto 1/2024.');
    });

    // TODO Com erro:

    it('deveria descrever dois grupos, o primeiro com tres dispositivos sequenciais, segundo com dois dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('005'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3 a 5, 9 e 10 do Veto 1/2024.');
    });

    it('deveria descrever dois grupos, separando o primeiro com dois dispositivos sequenciais, segundo com dois dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3, 4, 9 e 10 do Veto 1/2024.');
    });

    it('deveria descrever dois grupos, primeiro com tres dispositivos sequenciais, segundo com dois dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('008'),
        criarNovoDispositivo('009')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3, 4, 8 e 9 do Veto 1/2024.');
    });

    it('deveria descrever dois grupos, primeiro com tres dispositivos sequenciais, segundo com tres dispositivos sequenciais', () => {
      component.anoVeto = '2024';
      component.numeroVeto = 1;
      component.dispostivos = [
        criarNovoDispositivo('003'),
        criarNovoDispositivo('004'),
        criarNovoDispositivo('008'),
        criarNovoDispositivo('009'),
        criarNovoDispositivo('0010')];

      expect(component.descreverDispositivos()).toBe('dispositivos 3, 4 e 8 a 10 do Veto 1/2024.');
    });
  });
});

export function criarNovoDispositivo(numero: string): Dispositivo {
  return  Object.assign(new Dispositivo, {
    'numeroIdentificador': '01.24.' + numero,
    'texto': 'Texto teste' + numero,
    'conteudo': 'Conteudo teste' + numero,
    'selected': true
  });
}
