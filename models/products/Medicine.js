const {conn} = require('./../../db/mysql');
const {Product} = require('./Product');

class Medicine extends Product{
    constructor(obj){

        if(new.target === Medicine) throw new TypeError('Essa classe não pode ser instanciada diretamente');

        super(obj);

        this.composicao = obj.composicao;
        this.type = obj.type;
        

        this.id = null;
    }

    static findAll(){
     
        return new Promise((resolve, reject) => {
          
            conn.query('SELECT * FROM products WHERE type = ? OR type = ? OR type = ? OR type = ?', ['MedicineNone', 'MedicineBlack', 'MedicineRed', 'MedicineYellow'], (err, res) => {
             
                if(err) return reject(err);
                
                resolve(res);
            })
        });
    }

}

module.exports = {Medicine}