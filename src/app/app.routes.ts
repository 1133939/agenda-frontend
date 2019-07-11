import {Routes} from '@angular/router'
import { HomeComponent } from './home/home.component';
import { CadastrarClienteComponent } from './cadastrar-cliente/cadastrar-cliente.component';
import { CadastrarParecerComponent } from './cadastrar-parecer/cadastrar-parecer.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ParecerClienteComponent } from './parecer-cliente/parecer-cliente.component';
import { LoginComponent } from './login/login.component';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';

export const ROUTES : Routes = [
    {path: '', component: HomeComponent},   
    {path: 'cadastrar_cliente', component: CadastrarClienteComponent}, 
    {path: 'cadastrar_relatorio', component: CadastrarParecerComponent}, 
    {path: 'cliente/:id', component: ClienteComponent},
    {path: 'relatorio_cliente/:id', component: ParecerClienteComponent}, 
    {path: 'cadastrar_usuario', component: CadastrarUsuarioComponent}, 
    {path: 'login', component: LoginComponent}, 
]

