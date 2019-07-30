import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.css'],
  providers:[UsuarioService]
})
export class CadastrarUsuarioComponent implements OnInit {
  public usuarioCadastrado : boolean;
  public response : any;
 public formUsuario : FormGroup = new FormGroup({
  'crp': new FormControl(null),
  'nome': new FormControl(null,[Validators.required, Validators.minLength(3), Validators.maxLength(90)]),
  'email': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100) , Validators.email]),
  'senha' : new FormControl(null, [Validators.required,Validators.minLength(6), Validators.maxLength(30)]),
  'confirmarSenha' : new FormControl(null,[Validators.required,Validators.minLength(6), Validators.maxLength(30)])
 })
  constructor(private router : Router, private usuarioService : UsuarioService) { }

  ngOnInit() {

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
  cadastrarUsuario(){
    this.response=undefined;
    let response : any = {};
    response.status = 800;
    this.response=response;
    console.log(this.response)
    if(this.formUsuario.valid){
      this.usuarioService.getUsuarioByEmailReduzido(this.formUsuario.get('email').value).subscribe((response:any)=>{
        if(response.email == null){
          let usuario : Usuario = new Usuario
          (null,
            this.formUsuario.get('crp').value,
            this.formUsuario.get('nome').value,
            this.formUsuario.get('email').value,
            this.formUsuario.get('senha').value, 
            null)
           this.usuarioService.cadastrarUsuario(usuario).subscribe((response:any)=>{
             console.log(response)
            this.response=response;
            })
          }else{
            this.formUsuario.get('email').markAsPending()
          }
        })
      }else{
        this.formUsuario.get('nome').markAsTouched(),
        this.formUsuario.get('email').markAsTouched(),
        this.formUsuario.get('senha').markAsTouched(),
        this.formUsuario.get('confirmarSenha').markAsTouched()
      }    
      }
}
