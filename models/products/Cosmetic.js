const {conn} = require('./../../db/mysql');
const {Product} = require('./Product');

class Cosmetic extends Product{
    constructor(obj){

        super(obj);

        this.contraIndicativos = obj.contraIndicativos;
        this.type = 'Cosmetic';

        this.id = null;
    }

    static findAll(){
     
        return new Promise((resolve, reject) => {
          
            conn.query('SELECT * FROM products WHERE type = ? ', ['Cosmetic'], (err, res) => {
             
                if(err) return reject(err);
                
                resolve(res);
            })
        });
    }
}

module.exports = {Cosmetic}