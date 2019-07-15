import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { Cliente } from '../model/cliente.model';
import { ClienteService } from '../service/cliente.service';
import { distinctUntilChanged, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers:[ClienteService, UsuarioService]
})
export class TopoComponent implements OnInit {
  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public clientes : Observable<Array<Cliente>>
  public usuario : Usuario = new Usuario(null,null,null,null,null)
  private subjectPesquisa : Subject<string> = new Subject<string>()
  constructor(private clienteService : ClienteService, private usuarioService : UsuarioService, private router : Router) { }

  ngOnInit() {
    if(localStorage.getItem('user') !=null){

      this.usuarioService.getUsuarioByEmail(this.jwtHelperService.decodeToken(localStorage.getItem('user').substr(7)).sub).subscribe((response:any)=>{
        this.usuario = response;
      })
      this.clientes = this.subjectPesquisa //retorno Oferta[]
      .pipe(debounceTime(1000),distinctUntilChanged(), switchMap((termo:string)=>{
        if(termo.trim()===''){
          return of<Array<Cliente>>([])
        }   
        return this.clienteService.pesquisaCliente(termo, this.usuario.id)  //observable de array de ofertas
        
      }),catchError((erro) => {
        console.log(erro)
        return of<Array<Cliente>>([])
      })
      
      )  }
    }

  public pesquisa(pesquisa : string){

      this.subjectPesquisa.next(pesquisa)
  }
  public limpaPesquisa():void{
    this.subjectPesquisa.next('')
  }


  logout(){
    localStorage.removeItem('user')
    this.router.navigate(['/login'])
  }

}
