import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../service/usuario.service';
import { Credenciais } from '../model/credenciais.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../model/usuario.model';
import { debounceTime, retry, timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UsuarioService]
})
export class LoginComponent implements OnInit {
  public error : HttpErrorResponse;
  public response : any;
  public formLogin : FormGroup = new FormGroup({
    'email' : new FormControl(null, [Validators.required]),
    'senha' : new FormControl(null, [Validators.required])
  })
  public usuario : Usuario = new Usuario(null,null,null,null,null,null)
  public token : string
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  constructor(private usuarioService : UsuarioService, private router : Router ) { }

  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{
      if(this.jwtHelperService.isTokenExpired(localStorage.getItem('user').substr(7))){
        localStorage.removeItem('user')
        this.router.navigate(['/login'])
      }else{
        this.router.navigate(['/'])
      }
    }

  }
  login() :void{
    this.error = undefined;
    this.response = undefined;
    if(this.formLogin.valid){
    let usuario : Credenciais = new Credenciais (this.formLogin.value.email, this.formLogin.value.senha)
    this.usuarioService.auth(usuario).subscribe((response:any)=>{
      this.token = response.headers.get('Authorization')
      localStorage.setItem('user',this.token);
      this.router.navigate([''])
    },error=>{this.error = error})

          
  }
}
  testarConexao(): void{
    this.error = undefined;
    this.response = undefined;
    let response : any = {};
    response.status = 800;
    this.response=response;
    let email : string = "WW"
    this.usuarioService.testarConexao(email).subscribe((response:any)=>{
      console.log(response)
      this.response = response;
    },error=>{
      console.log(error)
      this.error = error})

  }
}
