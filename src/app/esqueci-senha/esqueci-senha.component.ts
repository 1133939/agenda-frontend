import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailDTO } from '../model/emailDTO.model';
import { AuthService } from '../service/auth.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css'],
  providers:[AuthService]
})
export class EsqueciSenhaComponent implements OnInit {
  public response : any;
  public form : FormGroup = new FormGroup({
  'email' : new FormControl(null,[Validators.required])
  })
  constructor(private usuarioService : AuthService) { }

  ngOnInit() {
  }
forgot(){
  this.response = undefined;
if(this.form.valid){
  this.usuarioService.forgot(new EmailDTO(this.form.get('email').value)).subscribe((response:any)=>{
    this.response = response;
  },(error:any)=>{
    this.response = error;

  })
}
}
}
