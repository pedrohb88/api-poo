const {conn} = require('./../../db/mysql');
const {Medicine} = require('./Medicine');

class MedicineBlack extends Medicine{
    constructor(obj){

        super(obj);

        this.contraIndicativos = obj.contraIndicativos;
        this.efeitosColaterais = obj.efeitosColaterais;

        this.id = null;
    }

    avaliarReceita(){
        //avaliar e reter receita
    }
}

module.exports = {MedicineBlack}