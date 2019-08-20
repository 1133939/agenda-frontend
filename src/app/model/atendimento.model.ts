import { Cliente } from './cliente.model';

export class Atendimento{
    constructor(public id : number, public titulo : string, public descricao : string, public data : Date, public cliente : Cliente){

    }
}