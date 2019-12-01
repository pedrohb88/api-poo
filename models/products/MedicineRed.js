const {conn} = require('./../../db/mysql');
const {Medicine} = require('./Medicine');

class MedicineRed extends Medicine{
    constructor(obj){

        super(obj);

        this.contraIndicativos = obj.contraIndicativos;

        this.id = null;
    }

    avaliarReceita(receita){
        //avaliar receita
    }
}

module.exports = {MedicineRed}