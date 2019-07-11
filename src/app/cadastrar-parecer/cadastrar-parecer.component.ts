import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-parecer',
  templateUrl: './cadastrar-parecer.component.html',
  styleUrls: ['./cadastrar-parecer.component.css']
})
export class CadastrarParecerComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/login'])
    }else{

    }
  }

}
