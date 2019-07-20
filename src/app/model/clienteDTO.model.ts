import { Usuario } from './usuario.model';
import { Parecer } from './parecer.model';

export class ClienteDTO{
    constructor(
        public id : number, 
        public nome : string, 
        public telefone : string, 
        public endereco : string, 
        public descricao : string,
        public dataNascimento : Date, 
        public pareceres : Array<Parecer>,
        public usuario : Usuario,
       ){

    }
}