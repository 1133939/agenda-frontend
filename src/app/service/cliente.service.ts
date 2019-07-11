import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable } from 'rxjs';
import {  retryWhen, delay, take, map, retry } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/cliente.model';

@Injectable()
export class ClienteService {
constructor(public http : HttpClient){
}

 getClienteById(id : number) : Observable<any>{
return this.http.get(`${URL_API}/cliente/${id}`).pipe(map((response:any)=>{
    return response;
}))
 }
 pesquisaCliente(termo : string, id : number): Observable<Array<Cliente>>{
    return this.http.get<Array<Cliente>>(`${URL_API}/cliente/usuario/${id}/nome/${termo}`)
    .pipe(retry(10))
    .pipe(map((resposta:any) => resposta))
}
}