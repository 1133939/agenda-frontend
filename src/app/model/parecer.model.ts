import { Cliente } from './cliente.model';

export class Parecer {
    constructor(
        public id : number,
        public data : Date,
        public cliente : Cliente,
        public titulo : string,
        public descricao : string,    
        ){

    }
}