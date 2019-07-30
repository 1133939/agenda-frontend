import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../service/usuario.service';
import { ClienteService } from '../service/cliente.service';
import { Cliente } from '../model/cliente.model';
import { ParecerService } from '../service/parecer.service';
import { Parecer } from '../model/parecer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteDTO } from '../model/clienteDTO.model';
import { UsuarioDTO } from '../model/usuarioDTO.model';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers:[UsuarioService, ClienteService, ParecerService]
})
export class ClienteComponent implements OnInit {
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null,null)
  public email:string
  public pageObj : any;
  public page : number = 0;
  public response : any;
  public transferiu : boolean = false;
  public cliente : Cliente
  public usuarioTransferir : Usuario;
  public pareceres : Array<Parecer>
  public formUpdate : FormGroup = new FormGroup({
    'descricao' : new FormControl(null,[Validators.required])
  })
  public formDatas : FormGroup = new FormGroup({
    'dataInicial' : new FormControl(null,[Validators.required, Validators.minLength(10)]),
    'dataFinal' : new FormControl(null,[Validators.required, Validators.minLength(10)])
  })
  public formUpdateCliente : FormGroup = new FormGroup({
    'nome' : new FormControl(null, [Validators.required]),
    'telefone' : new FormControl(null, [Validators.required]),
    'nascimento' : new FormControl(null, [Validators.required]),
    'endereco' : new FormControl(null, [Validators.required]),

  })
  public formTransferir : FormGroup = new FormGroup({
    'email' : new FormControl(null,[Validators.required])
  })
  constructor(private router : Router, 
    private route :ActivatedRoute, 
    private usuarioService : UsuarioService,
    private clienteService : ClienteService,
    private parecerService : ParecerService
    
    ) { }

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
           this.getPagePareceres();
        })
        this.parecerService.getParecerByIdCliente(aux.id).subscribe((response:any)=>{
          this.pareceres = response;
        })
      }
    }
  }
  addDescricao(){
    this.response = undefined;
    let cliente : ClienteDTO = new ClienteDTO(this.cliente.id,null,null,null,this.formUpdate.get('descricao').value,null,null,null)
    this.clienteService.updateCliente(cliente).subscribe((response:any)=>{
      this.response = response;
    })
  }
  buscarPorData(){
    if(this.formDatas.valid){
      let dataInicial : Date = new Date();
      let dataFinal : Date = new Date();
      dataInicial.setHours(0,0,0,0);
      dataFinal.setHours(23,59,59,59);
      let ano : number = this.formDatas.get('dataInicial').value.substr(0,4)
      let mes : number = this.formDatas.get('dataInicial').value.substr(5,2)-1
      let dia : number = this.formDatas.get('dataInicial').value.substr(8,2)
      dataInicial.setFullYear(ano,mes,dia)
      let anoF : number = this.formDatas.get('dataFinal').value.substr(0,4)
      let mesF : number = this.formDatas.get('dataFinal').value.substr(5,2)-1
      let diaF : number = this.formDatas.get('dataFinal').value.substr(8,2)
      dataFinal.setFullYear(anoF,mesF,diaF);
      
      this.parecerService.getPareceresBetweenTwoDates(
        this.cliente.id,
        dataInicial,
        dataFinal).subscribe((response:any)=>{
          this.pageObj = response;
        })
      }else{
        if(this.formDatas.get('dataFinal').invalid){
          this.formDatas.get('dataFinal').markAsPending();
        }
        if(this.formDatas.get('dataInicial').invalid){
          this.formDatas.get('dataInicial').markAsPending();
        }
      }
    }
    updateCliente(){
    this.response = undefined;
    let cliente : ClienteDTO = new ClienteDTO(this.cliente.id,null,null,null,null,null,null,null);
    if(this.formUpdateCliente.get('nome').value !=null && this.formUpdateCliente.get('nome').value !=""){
      cliente.nome=this.formUpdateCliente.get('nome').value
      }
      if(this.formUpdateCliente.get('nascimento').value !=null && this.formUpdateCliente.get('nascimento').value !=""){
        let dataNasc : Date = new Date();
        dataNasc.setFullYear(
          +this.formUpdateCliente.get('nascimento').value.substr(4,4), 
          +this.formUpdateCliente.get('nascimento').value.substr(2,2)-1,
          +this.formUpdateCliente.get('nascimento').value.substr(0,2));

          cliente.dataNascimento=dataNasc;
      }
      if(this.formUpdateCliente.get('telefone').value !=null && this.formUpdateCliente.get('telefone').value !=""){
        cliente.telefone=this.formUpdateCliente.get('telefone').value
      }
      if(this.formUpdateCliente.get('endereco').value !=null && this.formUpdateCliente.get('endereco').value !=""){
        cliente.endereco =  this.formUpdateCliente.get('endereco').value
      }
    this.clienteService.updateCliente(cliente).subscribe((response:any)=>{
      this.response = response;
      this.buscandoCliente(this.cliente.id);

    })

  }
  transferirCliente(){
    this.usuarioTransferir=null;
this.usuarioService.getUsuarioByEmailReduzido(this.formTransferir.get('email').value).subscribe((response:any)=>{
  this.usuarioTransferir = response;
})
  }
  cancelarTransferencia(){
    this.usuarioTransferir=null;
  }
  confirmarTransferencia(){
    let cliente : ClienteDTO = new ClienteDTO (this.cliente.id,null,null,null,null,null,null,null);
    let clientes : Array<ClienteDTO> = new Array<ClienteDTO>();
    clientes.push(cliente);
    let usuario : UsuarioDTO = new UsuarioDTO(this.usuario.id,null,null,null,clientes)
    this.usuarioService.transferirUsuario(this.usuarioTransferir.id,usuario).subscribe((response:any)=>{
      this.usuarioTransferir = response;
      this.transferiu=true;
      this.cliente=null;
      this.usuarioTransferir=null;
      this.pareceres=null
    })
  }
  mudarStatusCliente(status : string){
    let cliente : Cliente = new Cliente(this.cliente.id,null,null,null,null,null,null,null,null);
    if(status=='ativo'){
cliente.status=0;
    }else
    if(status == 'inativo'){
cliente.status=1;
    }
    this.clienteService.updateCliente(cliente).subscribe((response:any)=>{
      this.buscandoCliente(this.cliente.id);
      return response;
    })
  }

  getPagePareceres(page : number = 0, linesPerPage : number = 10){
    this.parecerService.findParecerByUsuarioPage(this.cliente.id,page,linesPerPage).subscribe((response:any)=>{
      this.pageObj = response;
    })
  }
  pageSeguinte(){
  this.page++;
  this.getPagePareceres(this.page);
  }
  pageAnterior(){
    if(this.page>0){
      this.page--;
      this.getPagePareceres(this.page);
    }
  }
  setPagina(page : number){
  this.page= page;
  this.getPagePareceres(this.page);
  }
}
