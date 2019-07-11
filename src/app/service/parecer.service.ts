import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable } from 'rxjs';
import {  retryWhen, delay, take, map } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parecer } from '../model/parecer.model';

@Injectable()
export class ParecerService {
constructor(public http : HttpClient){
}

 getParecerById(id : number) : Observable<any>{
return this.http.get(`${URL_API}/parecer/${id}`).pipe(map((response:any)=>{
    return response;
}))
 }
 getParecerByIdCliente(id : number) : Observable<any>{
    return this.http.get(`${URL_API}/parecer/cliente/${id}`).pipe(map((response:any)=>{
        return response;
    }))
     }
     saveParecer(parecer : Parecer){
        let headers = new HttpHeaders({'Content-Type' : 'application/json'})
        let options = {headers}
        console.log(parecer.cliente.id)
         return this.http.post(`${URL_API}/parecer`,(parecer),options).pipe(map((response:any)=>{
             return response;
         }))
     }
}