import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../model/usuario.model';
import { Cliente } from '../model/cliente.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[UsuarioService]
})
export class HomeComponent implements OnInit {
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null)
  public email:string
  public clientes : Array<Cliente>
  constructor(private router : Router, private usuarioService : UsuarioService) { }

  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{
      
      this.email = this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub
      this.usuarioService.getUsuarioByEmail(this.email).subscribe((response:any)=>{
        this.usuario = response;
      })
    }
      

  }
mostrarCliente(cliente : Cliente){
  this.router.navigate(['/cliente'])
  console.log(cliente)
}
}
