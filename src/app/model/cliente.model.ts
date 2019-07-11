import { Parecer } from './parecer.model';

export class Cliente {
    constructor(public id : number, public nome : string, public telefone : string, public idade : string, public endereco : string, public descricao : string, public pareceres : Array<Parecer>){

    }
}