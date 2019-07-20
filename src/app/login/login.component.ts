import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../service/usuario.service';
import { Credenciais } from '../model/credenciais.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../model/usuario.model';
import { debounceTime, retry, timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UsuarioService]
})
export class LoginComponent implements OnInit {
  public formLogin : FormGroup = new FormGroup({
    'email' : new FormControl(null, [Validators.required]),
    'senha' : new FormControl(null, [Validators.required])
  })
  public usuario : Usuario = new Usuario(null,null,null,null,null)
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
    let usuario : Credenciais = new Credenciais (this.formLogin.value.email, this.formLogin.value.senha)
    this.usuarioService.auth(usuario).subscribe((response:any)=>{
      this.token = response.headers.get('Authorization')
      localStorage.setItem('user',this.token);
      this.router.navigate([''])
    },error=>{})

    
  }
}
