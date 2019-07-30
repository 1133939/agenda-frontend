import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { ClienteService } from '../service/cliente.service';
import { Usuario } from '../model/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ParecerService } from '../service/parecer.service';
import { Parecer } from '../model/parecer.model';
import { Cliente } from '../model/cliente.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-parecer-cliente',
  templateUrl: './parecer-cliente.component.html',
  styleUrls: ['./parecer-cliente.component.css'],
  providers:[UsuarioService, ClienteService, ParecerService]
})
export class ParecerClienteComponent implements OnInit {

  public jwtHelperService : JwtHelperService = new JwtHelperService();
  public usuario : Usuario = new Usuario(null,null,null,null,null,null)
  public blob : Blob;
  public email:string
  public response : any;
  public parecer : Parecer
  public cliente : Cliente
  public excluido : number=0;
  public formUpdateParecer : FormGroup = new FormGroup({
'titulo' : new FormControl(null, Validators.maxLength(60)),
'descricao' : new FormControl(null),
  })
  constructor(private router : Router, 
    private route :ActivatedRoute, 
    private usuarioService : UsuarioService,
    private clienteService : ClienteService,
    private parecerService : ParecerService
    
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
        this.buscandoParecer(parametros.id);
      })
    })
  }}}
  buscandoParecer(param : number){

        this.parecerService.getParecerById(param).subscribe((response:any)=>{
this.cliente = response.body.cliente;
this.parecer=response.body;
        })
      }
  updateParecer(){
    if(this.formUpdateParecer.valid){
    this.response = undefined;
    let parecer : Parecer = new Parecer(this.parecer.id,null,null,null,null)
    if(this.formUpdateParecer.get('titulo').value!=null || this.formUpdateParecer.get('titulo').value!=""){
parecer.titulo=this.formUpdateParecer.get('titulo').value;
    }
    if(this.formUpdateParecer.get('descricao').value!=null || this.formUpdateParecer.get('descricao').value!=""){
      parecer.descricao=this.formUpdateParecer.get('descricao').value;
    }
    this.parecerService.updateParecer(parecer).subscribe((response:any)=>{
    this.response=response
    this.buscandoParecer(this.parecer.id);
    })       
  }
  }
  excluirParecer(){
    this.response = undefined;
    this.excluido=2;
    let parecer : Parecer = new Parecer(this.parecer.id,null,null,null,null)
    this.parecerService.deleteParecer(parecer).subscribe((response:any)=>{
      this.response = response
      this.excluido=1
      })
  }
  excluirOptions(){
    this.excluido=0;
  }
  downloadPDF(){
    this.parecerService.getPdf(this.parecer.id).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);});
    
      this.parecerService.getPdf(this.parecer.id).subscribe((data:any) => {

        this.blob = new Blob([data], {type: 'application/pdf'});
      
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.parecer.titulo+".pdf";
        link.click();
      
      });

  }
  

}
