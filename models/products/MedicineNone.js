const {conn} = require('./../../db/mysql');
const {Medicine} = require('./Medicine');

class MedicineNone extends Medicine{
    constructor(obj){

        super(obj);

        this.id = null;
        this.type = 'MedicineNone';
    }
}

module.exports = {MedicineNone}