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
    let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : localStorage.getItem('user')
    })
    let options = {headers}
return this.http.get(`${URL_API}/parecer/${id}`,options).pipe(map((response:any)=>{
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
        let options = {headers}
        parecer.cliente.status=0;
         return this.http.post(`${URL_API}/parecer`,(parecer),options).pipe(map((response:any)=>{
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
        let options = {headers}
        return this.http.get(`${URL_API}/parecer/cliente/${id}/datas/${dataInicial}/${dataFinal}`,options)
        .pipe(map((response:any)=>{
            return response;
        }))
     }
     updateParecer(parecer : Parecer):Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
        let options = {headers}
    return this.http.put(`${URL_API}/parecer/${parecer.id}`,(parecer),options).pipe(map((response:any)=>{
            console.log(response)
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
        let options = {headers}
    return this.http.delete(`${URL_API}/parecer/${parecer.id}`,options).pipe(map((response:any)=>{
            console.log(response)
            return response;
    })).pipe(retryWhen((errors : any)=> {
        return errors.pipe(delay(10), take(1))}
       ))
     }
    //  getPDF(id : number){
    //     let headers = new HttpHeaders({
    //     'Authorization' : localStorage.getItem('user'),
    //     responseType : 'blob',
    //     Accept : 'application/pdf',
    //     observe : 'response'
    //   })
    //     let options = {headers}
    //     return this.http.get(`${URL_API}/parecer/${id}/download`,options)
    //     .pipe(map((response:any)=>{
    //         return response;
    //     }))
    //  }
    
     getPdf(id : number) {     
        const options = {
          responseType: 'blob' as 'json',
          headers: new HttpHeaders({
            'Authorization': localStorage.getItem('user'),
        
          })
        };
        
        return this.http.get(`${URL_API}/parecer/${id}/download`,options);
        }
}

