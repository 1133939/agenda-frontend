import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable, throwError } from 'rxjs';
import {  retryWhen, delay, take, map, catchError } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../model/usuario.model';
import { Cliente } from '../model/cliente.model';
import { UsuarioDTO } from '../model/usuarioDTO.model';

@Injectable()
export class UsuarioService {
constructor(public http : HttpClient){
}

auth(credenciais : Credenciais) : Observable<any>{
    return this.http.post(`${URL_API}/login`,(credenciais), {
        observe: 'response'}).pipe(map((response:any)=>{
            return response;
        })).pipe(catchError((error : any)=>{
               return throwError(error)
           }))
            
 }
 getUsuarioByEmail(email: string) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
return this.http.get(`${URL_API}/usuario/email/${email}`,options).pipe(map((response:any)=>{
    return response;
}))
 }
 getUsuarioByEmailReduzido(email: string) : Observable<any>{
    return this.http.get(`${URL_API}/usuario/email_reduzido/${email}`).pipe(map((response:any)=>{
        return response;
    }))
     }

 getClientesByUsuarioId(id : number) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
return this.http.get(`${URL_API}/cliente/usuario/${id}`,options).pipe(map((response:any)=>{
    return response;
}))
 }
 cadastrarUsuario(usuario : Usuario) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
    })
return this.http.post(`${URL_API}/usuario`,(usuario),{
    observe: 'response',
    responseType: 'text',
    headers
}).pipe(map((response:any)=>{
    return response;
})).pipe(retryWhen((errors : any)=> {
    return errors.pipe(delay(10), take(10))}
   ))
 }
 updateUsuario(id: number, usuario : Usuario){
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
return this.http.put(`${URL_API}/usuario/${id}`,(usuario),{
    observe: 'response',
    responseType: 'text',
    headers
}).pipe(map((response:any)=>{
        return response;
})).pipe(retryWhen((errors : any)=> {
    return errors.pipe(delay(10), take(1))}
   ))
 }
 transferirUsuario(id: number, usuario : UsuarioDTO){
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
return this.http.put(`${URL_API}/usuario/${id}`,(usuario),options).pipe(map((response:any)=>{
        return response;
})).pipe(retryWhen((errors : any)=> {
    return errors.pipe(delay(10), take(10))}
   ))
 }
 testarConexao(email: string){
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
    })
    return this.http.get(`${URL_API}/usuario/email_reduzido/${email}`,{
        observe: 'response',
        responseType: 'text',
        headers
    })
    .pipe(map((response:any)=>{
        return response;
    }))
 }
}