import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailDTO } from '../model/emailDTO.model';
import { Observable, throwError } from 'rxjs';
import { URL_API } from '../util/URL_API';
import { map, retryWhen, delay, take, catchError } from 'rxjs/operators';

@Injectable()
export class AuthService{
    constructor(public http : HttpClient){
    }

    forgot(emailDTO : EmailDTO):Observable<any>{
        let headers = new HttpHeaders({
            'Content-Type' : 'application/json',
        })
    return this.http.post(`${URL_API}/auth/forgot`,(emailDTO),{
        observe: 'response',
        responseType: 'text',
        headers
    }).pipe(map((response:any)=>{
        return response;
    }))
       .pipe(catchError((error:any)=>{
           return throwError(error);
       }))
    }

}