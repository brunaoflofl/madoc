import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ModeloListagem } from '../model/modelo-listagem-dto';
import { TipoDocumento } from '../model/tipo-documento-dto';
import { Modelo } from '../model/modelo-dto';
import { SaveDto } from '../model/save-dto';
import { map } from 'rxjs/operators';
import { Casa } from '../model/casa-dto';

@Injectable()
export class CatalogoService {
    constructor(private http: HttpClient) { }

    getTiposDocumento(): Observable<TipoDocumento[]> {
        return this.http.get<TipoDocumento[]>(`/madoc/api/dados/json/tipos-documento`);
    }

    getCasas(): Observable<Casa[]> {
        return this.http.get<Casa[]>(`/madoc/api/dados/json/casas-legislativas`);
    }

    getModelos(tipoDocumento: string): Observable<ModeloListagem[]> {
        return this.http.get<ModeloListagem[]>(`/madoc/api/modelos/${tipoDocumento}`);
    }

    getModelo(id: string): Observable<Modelo> {
        return this.http.get<Modelo>(`/madoc/api/novo/${id}`);
    }

    salva(saveDto: SaveDto): Observable<boolean> {
        return this.http
            .post('/madoc/api/salvar', saveDto, { responseType: 'text' })
            .pipe(map((resposta) => (resposta === 'OK' ? true : false)));
    }
}
