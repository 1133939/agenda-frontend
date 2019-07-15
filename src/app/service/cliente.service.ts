import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable } from 'rxjs';
import {  retryWhen, delay, take, map, retry } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

 getClienteByUsuarioAndAtivo(id : number) : Observable<any>{
    return this.http.get(`${URL_API}/cliente/ativos/usuario/${id}`).pipe(map((response:any)=>{
        return response;
    }))
     }

 pesquisaCliente(termo : string, id : number): Observable<Array<Cliente>>{
    return this.http.get<Array<Cliente>>(`${URL_API}/cliente/usuario/${id}/nome/${termo}`)
    .pipe(retry(10))
    .pipe(map((resposta:any) => resposta))
}
findClienteByNome(termo: string, id:number) :Observable<any>{
    return this.http.get<Array<Cliente>>(`${URL_API}/cliente/nome/${termo}/${id}`)
    .pipe(map((resposta:any) => {
       return resposta
    }))
}
cadastrarCliente(cliente : Cliente):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json'
    })
  
return this.http.post(`${URL_API}/cliente`,(cliente),{
    observe: 'response',
    responseType: 'text'
}).pipe(map((response:any)=>{
    return response;
}))
}
updateCliente(cliente : Cliente):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
return this.http.put(`${URL_API}/cliente/${cliente.id}`,(cliente),options,).pipe(map((response:any)=>{
        console.log(response)
        return response;
}))
}
}