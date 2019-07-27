import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../model/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css'],
  providers:[UsuarioService]
})
export class UpdateUsuarioComponent implements OnInit {
  public usuarioCadastrado : boolean;
  public email : string;
  public response : any;
  public usuario : Usuario;
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public formUsuario : FormGroup = new FormGroup({
   'nome': new FormControl(null,[Validators.minLength(3), Validators.maxLength(60)]),
   'senha' : new FormControl(null, [Validators.minLength(6), Validators.maxLength(30)]),
   'confirmarSenha' : new FormControl(null,[Validators.minLength(6), Validators.maxLength(30)])
  })
   constructor(private router : Router, private usuarioService : UsuarioService) { }
 
   ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else
    if(localStorage.getItem('user')!= null){
      if(this.jwtHelperService.isTokenExpired(localStorage.getItem('user').substr(7))){
        localStorage.removeItem('user')
        this.router.navigate(['/login'])
      }
      else{
        this.email = this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub
        this.usuarioService.getUsuarioByEmail(this.email).subscribe((response:any)=>{
          this.usuario = response;
        })
      }
   
  }
   }
   setConfirmarSenha(senha : string){
     this.formUsuario.get('confirmarSenha').setValue(senha)
     if(this.formUsuario.get('confirmarSenha').value != this.formUsuario.get('senha').value){
       this.formUsuario.get('confirmarSenha').markAsPending()
     }
   }
   setSenha(senha : string){
     this.formUsuario.get('senha').setValue(senha)
   }
   updateUsuario(){
     this.usuarioCadastrado = false;
     if(this.formUsuario.valid){
           let usuario : Usuario = new Usuario
           (this.usuario.id,
             this.formUsuario.get('nome').value,
             null,
             this.formUsuario.get('senha').value, 
             null)
            this.usuarioService.updateUsuario(usuario.id,usuario).subscribe((response:any)=>{
             this.response=response;
             })
           }
       }   
       }
 
 