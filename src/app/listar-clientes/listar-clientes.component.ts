import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../model/usuario.model';
import { Cliente } from '../model/cliente.model';
import { ClienteService } from '../service/cliente.service';
import { AtendimentoService } from '../service/atendimento.service';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css'],
  providers:[UsuarioService,ClienteService, AtendimentoService]
})
export class ListarClientesComponent implements OnInit {
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null,null)
  public page : number = 0 ;
  public pageObj : any;
  public pageAtendimentos: any;
  public email:string
  public clientes : Array<Cliente>
  constructor(private router : Router, private usuarioService : UsuarioService, private clienteService : ClienteService, private atendimentoService : AtendimentoService) { }

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
         this.getPageClientes();
        })
      }
   
  }
}
getPageClientes(page : number = 0, linesPerPage : number = 10){
  this.clienteService.findClienteByUsuarioPage(this.usuario.id,page,linesPerPage).subscribe((response:any)=>{
    this.pageObj = response;
  })
}
pageSeguinte(){
this.page++;
this.getPageClientes(this.page);
}
pageAnterior(){
  if(this.page>0){
    this.page--;
    this.getPageClientes(this.page);
  }
}
setPagina(page : number){
this.page= page;
this.getPageClientes(this.page);
}
}
