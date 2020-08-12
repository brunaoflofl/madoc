import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
  })
  export class HttpService {
    constructor(private http: HttpClient) { }

    getXml(uri: string, query?: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'text/xml');
        if (query) {
            return this.http.get(uri + encodeURIComponent(query), { headers: headers, responseType: 'text' });
        } else {
            return this.http.get(uri, { headers: headers, responseType: 'text' });
        }
    }

    getJson(uri: string, query?: string): Observable<any> {
        if (query) {
            return this.http.get(uri + encodeURIComponent(query));
        } else {
            return this.http.get(uri);
        }
    }

    // getMaterias(query: string): Observable<any> {
    //     return this.http.get(
    //         HttpService.URL_SERVICO_SEARCH_MATERIAS + encodeURIComponent(query)
    //     );
    // }
    // getVetos(): Observable<any> {
    //     return this.http.get(HttpService.URL_SERVICO_SEARCH_VETOS);
    // }
    // getTramitacao(id: number): Observable<any> {
    //     return this.http.get(HttpService.URL_SERVICO_GET_TRAMITANDO + id);
    // }
    // getEmenta(materia: string): Observable<any> {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Accept', 'text/xml');
    // tslint:disable-next-line:max-line-length
    //     return this.http.get(HttpService.URL_SERVICO_GET_EMENTA + encodeURIComponent(materia), { headers: headers, responseType: 'text' });
    // }
}
