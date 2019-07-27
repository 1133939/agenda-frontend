import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable } from 'rxjs';
import {  retryWhen, delay, take, map, retry, catchError } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../model/cliente.model';
import { ClienteDTO } from '../model/clienteDTO.model';

@Injectable()
export class ClienteService {
constructor(public http : HttpClient){
}

 getClienteById(id : number) : Observable<any>{    let headers = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Authorization' : localStorage.getItem('user')
})
let options = {headers}
return this.http.get(`${URL_API}/cliente/${id}`,options).pipe(map((response:any)=>{
    return response;
}))
 }

 getClienteByUsuarioAndAtivo(id : number) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
    return this.http.get(`${URL_API}/cliente/ativos/usuario/${id}`,options).pipe(map((response:any)=>{
        return response;
    })).pipe(retryWhen((errors : any)=> {
        return errors.pipe(delay(10), take(1))}
       ))
     }

 pesquisaCliente(termo : string, id : number): Observable<Array<Cliente>>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
    return this.http.get<Array<Cliente>>(`${URL_API}/cliente/usuario/${id}/nome/${termo}`,options)
    .pipe(retry(10))
    .pipe(map((resposta:any) => resposta))
}
findClienteByNome(termo: string, id:number) :Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
    return this.http.get<Array<Cliente>>(`${URL_API}/cliente/nome/${termo}/${id}`,options)
    .pipe(map((resposta:any) => {
       return resposta
    })).pipe(retryWhen((errors : any)=> {
        return errors.pipe(delay(10), take(1))}
       ))
}
cadastrarCliente(cliente : Cliente):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
return this.http.post(`${URL_API}/cliente`,(cliente),{
    observe: 'response',
    responseType: 'text',
    headers
}).pipe(map((response:any)=>{
    return response;
})).pipe(retryWhen((errors : any)=> {
    return errors.pipe(delay(10), take(1))}
   )).pipe(catchError((error:any)=>{
       console.log(error)
       return error;
   }))
}
updateCliente(cliente : ClienteDTO):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
return this.http.put(`${URL_API}/cliente/${cliente.id}`,(cliente),{
    observe: 'response',
    responseType: 'text',
    headers
})
.pipe(map((response:any)=>{
    return response;
})).pipe(retryWhen((errors : any)=> {
    return errors.pipe(delay(10), take(10))}
   ))
}
findClienteByUsuarioPage(id : number, page : number = 0, linesPerPage : number = 10) {
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
    return this.http.get(`${URL_API}/cliente/page/${id}?page=${page}&linesPerPage=${linesPerPage}`,options)
    .pipe(retry(10))
    .pipe(map((resposta:any) => resposta))
  }
}