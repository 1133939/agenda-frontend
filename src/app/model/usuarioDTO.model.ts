import { ClienteDTO } from './clienteDTO.model';

export class UsuarioDTO {
    constructor(public id : number, public nome : string, public email : string, public senha : string, public clientes : Array<ClienteDTO>){
    }
}