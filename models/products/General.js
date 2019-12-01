const {conn} = require('./../../db/mysql');
const {Product} = require('./Product');

class General extends Product{
    constructor(obj){

        super(obj);

        this.category = obj.category;
        this.type = 'General';

        this.id = null;
    }

    static findAll(){
     
        return new Promise((resolve, reject) => {
          
            conn.query('SELECT * FROM products WHERE type = ? ', ['General'], (err, res) => {
             
                if(err) return reject(err);
                
                resolve(res);
            })
        });
    }
}

module.exports = {General}