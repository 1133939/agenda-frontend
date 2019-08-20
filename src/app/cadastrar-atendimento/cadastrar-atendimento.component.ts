import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { ClienteService } from '../service/cliente.service';
import { Cliente } from '../model/cliente.model';
import { AtendimentoService } from '../service/atendimento.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Atendimento } from '../model/atendimento.model';

@Component({
  selector: 'app-cadastrar-atendimento',
  templateUrl: './cadastrar-atendimento.component.html',
  styleUrls: ['./cadastrar-atendimento.component.css'],
  providers:[UsuarioService, ClienteService, AtendimentoService]
})
export class CadastrarAtendimentoComponent implements OnInit {
public jwtHelperService : JwtHelperService = new JwtHelperService();
private email : string
public usuario : Usuario
public response : any
public cliente : Cliente
public form : FormGroup = new FormGroup({
  'titulo': new FormControl(null,[Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
  'descricao': new FormControl(null,[Validators.required, Validators.minLength(10), Validators.maxLength(500000)]),
  'data': new FormControl(null,[Validators.required])
})
  constructor(private router : Router, private route : ActivatedRoute, private usuarioService : UsuarioService, private clienteService : ClienteService, private atendimentoService : AtendimentoService) { }

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
      this.route.params.subscribe((parametros:Params) => {
        this.buscandoCliente(parametros.id);
      })
    })
  }
}
}
  buscandoCliente(param : number){
    for(var aux of this.usuario.clientes){
      if(aux.id == param){
        this.clienteService.getClienteById(aux.id).subscribe((response:any)=>{
           this.cliente=response;
        })
      }
    }
  }
  cadastrarAtendimento(){
    if(this.form.valid){
      if(this.form.get('data').value!=null && this.form.get('data').value!=""){
        let data : Date = new Date();
        let ano : number = this.form.get('data').value.substr(0,4)
        let mes : number = this.form.get('data').value.substr(5,2)-1
        let dia : number = this.form.get('data').value.substr(8,2)
        data.setFullYear(ano,mes,dia)
        data.setHours(23,59,59,0);
        
        let atendimento : Atendimento = new Atendimento(null,this.form.get('titulo').value,this.form.get('descricao').value,data,this.cliente);
        this.atendimentoService.saveAtendimento(atendimento).subscribe((response:any)=>{
        this.response=response
        })
      }
    }  
  }
  }
