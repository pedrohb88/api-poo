const {conn} = require('./../../db/mysql');
const {Medicine} = require('./Medicine');

class MedicineYellow extends Medicine{
    constructor(obj){

        super(obj);

        this.genericoDe = obj.genericoDe;
        this.desconto = obj.desconto;

        this.id = null;
    }
}

module.exports = {MedicineYellow}