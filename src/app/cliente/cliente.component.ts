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

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers:[UsuarioService, ClienteService, ParecerService]
})
export class ClienteComponent implements OnInit {
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null)
  public email:string
  public cliente : Cliente
  public pareceres : Array<Parecer>
  public formUpdate : FormGroup = new FormGroup({
    'descricao' : new FormControl(null,[Validators.required])
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
    }else{
  
    }
    this.email = this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub
    this.usuarioService.getUsuarioByEmail(this.email).subscribe((response:any)=>{
      this.usuario = response;
      this.route.params.subscribe((parametros:Params) => {
        this.buscandoCliente(parametros.id);
      })
    })
  }
  buscandoCliente(param : number){
    for(var aux of this.usuario.clientes){
      if(aux.id == param){
        this.clienteService.getClienteById(aux.id).subscribe((response:any)=>{
this.cliente=response;
console.log(response)
        })
        this.parecerService.getParecerByIdCliente(aux.id).subscribe((response:any)=>{
          this.pareceres = response;
        })
      }
    }
  }
  addDescricao(){
    let cliente : Cliente = new Cliente(this.cliente.id,null,null,null,this.formUpdate.get('descricao').value,null,null,null)
    this.clienteService.updateCliente(cliente).subscribe((response:any)=>{
    console.log(response)
    })
  }

}
