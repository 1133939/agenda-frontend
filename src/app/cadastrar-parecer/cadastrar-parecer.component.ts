import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../model/usuario.model';
import { ClienteService } from '../service/cliente.service';
import { Cliente } from '../model/cliente.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ParecerService } from '../service/parecer.service';
import { Parecer } from '../model/parecer.model';

@Component({
  selector: 'app-cadastrar-parecer',
  templateUrl: './cadastrar-parecer.component.html',
  styleUrls: ['./cadastrar-parecer.component.css'],
  providers:[UsuarioService, ClienteService, ParecerService]
})
export class CadastrarParecerComponent implements OnInit {
  public usuario:Usuario;
  public clientes : Cliente;
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public form : FormGroup = new FormGroup({
    'cliente': new FormControl(null,[Validators.required]),
    'titulo': new FormControl(null,[Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
    'descricao': new FormControl(null,[Validators.required, Validators.minLength(10), Validators.maxLength(500000)])
  })
  constructor(private router : Router, private usuarioService : UsuarioService, private clienteService : ClienteService, private parecerService : ParecerService) { }

  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{
      let email = this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub;
        this.usuarioService.getUsuarioByEmail(email).subscribe((response:any)=>{
          this.usuario = response;
         this.clienteService.getClienteByUsuarioAndAtivo(this.usuario.id).subscribe((response:any)=>{
          this.clientes = response;
         })
        })

    }
  }
  cadastrarParecer(){
    if(this.form.valid){

      let cliente : Cliente = new Cliente(null,null,null,null,null,null,null,null)
      for(let aux of this.usuario.clientes){
        if(aux.nome==this.form.get('cliente').value){
          cliente.id = aux.id;
      }
    }
    if(cliente.id!=null){
      let parecer : Parecer = new Parecer(
        null,
        null,
        cliente,
        this.form.get('titulo').value,
        this.form.get('descricao').value)

        this.parecerService.saveParecer(parecer).subscribe((response:any)=>{
          console.log(response)
        })
      }else{
        this.form.get('cliente').markAsPending()
      }
    }
  }

}
