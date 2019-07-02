import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopoComponent } from './topo/topo.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CadastrarParecerComponent } from './cadastrar-parecer/cadastrar-parecer.component';
import { CadastrarClienteComponent } from './cadastrar-cliente/cadastrar-cliente.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ParecerClienteComponent } from './parecer-cliente/parecer-cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    LoginComponent,
    HomeComponent,
    CadastrarParecerComponent,
    CadastrarClienteComponent,
    ClienteComponent,
    ParecerClienteComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
