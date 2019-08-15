import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, throwError} from "rxjs";
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
 
 
@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private router : Router){

  }
    intercept(req: HttpRequest<any>, next: HttpHandler): any{
        return next.handle(req)
                .pipe(
                    catchError(error => {
                        let errorObj = error;
                        if(errorObj.error ){
                            errorObj = errorObj.error;
                        }
    
                        switch(error.status){
                            case 403: this.handle403();
                            break;
                            case 400: this.handle400();
                            break;
                            case 500: this.handle500();
                        }
                      
                       
                        return throwError(error);
                    })) as any;
    }
    handle403(){
        localStorage.removeItem('user')
        this.router.navigate(['/login'])
        alert('ACESSO NEGADO: Você foi desconectado!')

    }
    handle400(){
     //   localStorage.removeItem('user')
    }
    handle500(){
        this.router.navigate(['/'])
    }

} 
 
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};