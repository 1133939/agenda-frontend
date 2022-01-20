import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../model/usuario.model';
import { Cliente } from '../model/cliente.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { ClienteService } from '../service/cliente.service';
import { AtendimentoService } from '../service/atendimento.service';
import { Atendimento } from '../model/atendimento.model';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.css'],
  providers:[UsuarioService,AtendimentoService,ClienteService]
})
// comentário teste
export class AtendimentoComponent implements OnInit {

  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null,null)
  public email:string
  public response : any;
  public atendimento : Atendimento;
  public cliente : Cliente
  public excluido : boolean
  public formUpdate : FormGroup = new FormGroup({
'titulo' : new FormControl(null, Validators.maxLength(60)),
'descricao' : new FormControl(null),
'data' : new FormControl(null),
  })
  constructor(private router : Router, 
    private route :ActivatedRoute, 
    private usuarioService : UsuarioService,
    private clienteService : ClienteService,
    private atendimentoService : AtendimentoService
    
    ) { }
  ngOnInit() {
    this.response=undefined;
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
        this.buscandoAtendimento(parametros.id);
      })
    })
  }}}
  buscandoAtendimento(param : number){

        this.atendimentoService.getAtendimentoById(param).subscribe((response:any)=>{
this.cliente = response.body.cliente;
this.atendimento=response.body;
        })
      }
  updateAtendimento(){
    if(this.formUpdate.valid){
    this.response = undefined;
    let atendimento : Atendimento = new Atendimento(this.atendimento.id,null,null,null,null)
    if(this.formUpdate.get('titulo').value!=null && this.formUpdate.get('titulo').value!=""){
atendimento.titulo=this.formUpdate.get('titulo').value;
    }
    if(this.formUpdate.get('descricao').value!=null && this.formUpdate.get('descricao').value!=""){
      atendimento.descricao=this.formUpdate.get('descricao').value;
    }
    if(this.formUpdate.get('data').value!=null && this.formUpdate.get('data').value!=""){
      let data : Date = new Date();
      let ano : number = this.formUpdate.get('data').value.substr(0,4)
      let mes : number = this.formUpdate.get('data').value.substr(5,2)-1
      let dia : number = this.formUpdate.get('data').value.substr(8,2)
      data.setFullYear(ano,mes,dia)
      data.setHours(23,59,59,0);
      atendimento.data=data;
    }
    this.atendimentoService.updateAtendimento(atendimento).subscribe((response:any)=>{
    this.response=response
    this.buscandoAtendimento(this.atendimento.id);
    })       
  }
  }

  excluirAtendimento(){
    this.response = undefined;
    this.excluido=true;
    let atendimento : Atendimento = new Atendimento(this.atendimento.id,null,null,null,null)
    this.atendimentoService.deleteAtendimento(atendimento).subscribe((response:any)=>{
      this.response = response
      this.excluido=true;
      })
  }
  excluirOptions(){
    this.excluido=false;
  }

}
