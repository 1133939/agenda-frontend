import { Injectable } from '@angular/core';

import { Credenciais } from '../model/credenciais.model';
import { Observable } from 'rxjs';
import {  retryWhen, delay, take, map, retry } from 'rxjs/operators';
import { URL_API } from '../util/URL_API';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parecer } from '../model/parecer.model';

@Injectable()
export class ParecerService {
constructor(public http : HttpClient){
}

 getParecerById(id : number) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
return this.http.get(`${URL_API}/parecer/${id}`,{
    observe: 'response',
    responseType: 'json',
    headers
}).pipe(map((response:any)=>{

    return response;
}))
 }
 getParecerByIdCliente(id : number) : Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
    return this.http.get(`${URL_API}/parecer/cliente/${id}`,options).pipe(map((response:any)=>{
        return response;
    }))
     }
     saveParecer(parecer : Parecer){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
        parecer.cliente.status=0;
         return this.http.post(`${URL_API}/parecer`,(parecer),{
            observe: 'response',
            responseType: 'text',
            headers
        })
         .pipe(map((response:any)=>{
             return response;
         })).pipe(retryWhen((errors : any)=> {
            return errors.pipe(delay(10), take(1))}
           ))
     }
     getPareceresBetweenTwoDates(id:number, dataInicial:Date, dataFinal:Date){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
        return this.http.get(`${URL_API}/parecer/page/cliente/${id}/datas/${dataInicial}/${dataFinal}`,{
            observe:'response',
            responseType: 'json',
            headers
        })
        .pipe(map((response:any)=>{
            return response;
        }))
     }
     updateParecer(parecer : Parecer):Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
    return this.http.put(`${URL_API}/parecer/${parecer.id}`,(parecer),{
        observe: 'response',
        responseType: 'text',
        headers
    })
    .pipe(map((response:any)=>{
            return response;
    })).pipe(retryWhen((errors : any)=> {
        return errors.pipe(delay(10), take(1))}
       ))
     }
     deleteParecer(parecer : Parecer){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
    return this.http.delete(`${URL_API}/parecer/${parecer.id}`,{
        observe: 'response',
        responseType: 'text',
        headers
    })
    .pipe(map((response:any)=>{
            return response;
    })).pipe(retryWhen((errors : any)=> {
        return errors.pipe(delay(10), take(1))}
       ))
     }
    
     getPdf(id : number) {     
        const options = {
          responseType: 'blob' as 'json',
          headers: new HttpHeaders({
            'Authorization': localStorage.getItem('user'),
        
          })
        };
        
        return this.http.get(`${URL_API}/parecer/${id}/download2`,options);
        }
        findParecerByUsuarioPage(id : number, page : number = 0, linesPerPage : number = 10) {
            let headers = new HttpHeaders({
                'Content-Type' : 'application/json',
                'Authorization' : localStorage.getItem('user')
            })
            return this.http.get(`${URL_API}/parecer/page/${id}?page=${page}&linesPerPage=${linesPerPage}`,{
                observe: 'response',
                responseType: 'json',
                headers
            })
            .pipe(retry(10))
            .pipe(map((resposta:any) => resposta))
          }
}

