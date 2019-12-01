const {conn} = require('./../../db/mysql');

class Product{
    constructor(obj){

        if(new.target === Product) throw new TypeError('Essa classe não pode ser instanciada diretamente');

        this.name = obj.name;
        this.expirationDate = obj.expirationDate;
        this.price = obj.price;
        this.manufacturer = obj.manufacturer;
        this.description = obj.description;
        this.quantity = obj.quantity;

        this.id = null;
        this.type = null;
    }

    save(){
        return new Promise((resolve, reject) => {
            console.log(this);
            conn.query('INSERT INTO products SET ?', this, (err, res) => {
                if(err) reject(err);

                resolve();
            });
        });
       
    }

    static findAll(){
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM products', (err, res) => {
                
                if(err) return reject(err);
                
                resolve(res);
            })
        });
    }

    static getInfo(...ids){
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM products WHERE id IN (?)', ids, (err, res) => {
                if(err) reject(err);
    
                resolve(res);
            });
        });
    }
}

module.exports = {Product}