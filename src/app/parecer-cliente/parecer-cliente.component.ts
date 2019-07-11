import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { ClienteService } from '../service/cliente.service';
import { Usuario } from '../model/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ParecerService } from '../service/parecer.service';
import { Parecer } from '../model/parecer.model';
import { Cliente } from '../model/cliente.model';

@Component({
  selector: 'app-parecer-cliente',
  templateUrl: './parecer-cliente.component.html',
  styleUrls: ['./parecer-cliente.component.css'],
  providers:[UsuarioService, ClienteService, ParecerService]
})
export class ParecerClienteComponent implements OnInit {

  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null)
  public email:string
  public parecer : Parecer
  public cliente : Cliente
  constructor(private router : Router, 
    private route :ActivatedRoute, 
    private usuarioService : UsuarioService,
    private clienteService : ClienteService,
    private parecerService : ParecerService
    
    ) { }
  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{
  
    }
    this.email = this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub
    this.usuarioService.getUsuarioByEmail(this.email).subscribe((response:any)=>{
      this.usuario = response;
      this.route.params.subscribe((parametros:Params) => {
        this.buscandoParecer(parametros.id);
      })
    })
  }
  buscandoParecer(param : number){
    for(var aux of this.usuario.clientes){
     for(var aux2 of aux.pareceres){
      if(aux2.id == param){
        this.parecerService.getParecerById(aux2.id).subscribe((response:any)=>{
this.cliente = aux;
this.parecer=response;
        })
      }
     }
    }
  }

}
