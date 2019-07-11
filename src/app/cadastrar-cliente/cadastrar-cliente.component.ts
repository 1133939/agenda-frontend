import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-cliente',
  templateUrl: './cadastrar-cliente.component.html',
  styleUrls: ['./cadastrar-cliente.component.css']
})
export class CadastrarClienteComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{
     
    }
  }

}
