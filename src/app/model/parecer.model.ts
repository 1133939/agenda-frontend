import { Cliente } from './cliente.model';

export class Parecer {
    constructor(
        public id : number,
        public cliente : Cliente,
        public data : Date,
        public titulo : string,
        public descricao : string,    
        ){

    }
}