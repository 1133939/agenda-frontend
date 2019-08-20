import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { URL_API } from '../util/URL_API';
import { map, retryWhen, delay, take, catchError } from 'rxjs/operators';
import { Atendimento } from '../model/atendimento.model';

@Injectable()
export class AtendimentoService{
    constructor(public http : HttpClient){
    }

    saveAtendimento(atendimento : Atendimento){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
         return this.http.post(`${URL_API}/atendimento`,(atendimento),{
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

     getProximosAtendimentos(id : number, page : number = 0, linesPerPage : number = 10){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
        return this.http.get(`${URL_API}/atendimento/page/cliente/${id}/proximosAtendimentos?page=${page}&linesPerPage=${linesPerPage}`,{
            observe:'response',
            responseType: 'json',
            headers
        })
        .pipe(map((response:any)=>{
            console.log(response)
            return response;
        }))
     }

     getAllAtendimentos(id : number, page : number = 0, linesPerPage : number = 10){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
        console.log('ID',id)
        return this.http.get(`${URL_API}/atendimento/page/cliente/${id}`,{
            observe:'response',
            responseType: 'json',
            headers
        })
        .pipe(map((response:any)=>{
            return response;
        }))
     }

     getAtendimentoById(id : number) : Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
    return this.http.get(`${URL_API}/atendimento/${id}`,{
        observe: 'response',
        responseType: 'json',
        headers
    }).pipe(map((response:any)=>{
    
        return response;
    }))
     }

     updateAtendimento(atendimento : Atendimento):Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
    return this.http.put(`${URL_API}/atendimento/${atendimento.id}`,(atendimento),{
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

     deleteAtendimento(atendimento : Atendimento){
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('user')
        })
    return this.http.delete(`${URL_API}/atendimento/${atendimento.id}`,{
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
}