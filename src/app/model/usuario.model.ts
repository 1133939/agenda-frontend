import { Cliente } from './cliente.model';

export class Usuario {
    constructor(public id : number, public nome : string, public email : string, public senha : string, public clientes : Array<Cliente>){
    }
}