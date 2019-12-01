const _ = require('lodash');

const {Product} = require('./products/Product');
const {conn} = require('./../db/mysql');

class Order{

    constructor(obj){

        this.date = new Date();
        this.price = obj.price;
        this.itemsQuant = obj.itemsQuant;
        this.status = obj.status;

        this.products = [];

        this.customerId = obj.customerId;
    }

    static findByCustomerId(id){
        return new Promise((resolve, reject) => {
            
            conn.query(`select 
            o.id as 'orderId', o.date, o.price as 'totalPrice', o.itemsQuant as 'totalQuant', o.status, op.quantity as 'productQuant', p.*
            from orders o INNER JOIN orders_products op ON o.id = op.orderId 
            INNER JOIN products p ON op.productId=p.id 
            WHERE o.customerId = 44`, [id], function(err, res){
                
                if(err) return reject(err);

                let result = {};
                res.forEach((v) => {
                    if(!result[v.orderId]){
                        result[v.orderId] = {
                            info: {
                                date: v.date,
                                totalPrice: v.totalPrice,
                                totalQuant: v.totalQuant,
                                status: v.status
                            },
                            products: []
                        }
                    }

                    result[v.orderId].products.push(v);
                });

                resolve(result);
            });
        });
    }

    addProduct(...products){
        this.products = this.products.concat(products);
    }

    save(){
        return new Promise((resolve, reject) => {

            checkProductQuantity(this.products).then((result) => {
                if(result.error) return reject(`Quantidade disponível do produto "${result.product.name}" é insuficiente.`);
            
                let order = _.omit(this, ['products']);

                conn.query('INSERT INTO orders SET ?', order, (err, res) => {
                    if(err) return reject(err);
    
                    let orderId = res.insertId;
    
                    let products = this.products.map((v) => {
                        return [parseInt(orderId), parseInt(v.id), parseInt(v.quantity)];
                    });
    
                    conn.query('INSERT INTO orders_products(orderId, productId, quantity) VALUES ?', [products], (err, res) => {
    
                        if(err) return reject(err);
    
                        updateProductsQuantity(this.products);
                        
                        resolve();
                    });
                }); 
            });  
        })
    }
}

async function checkProductQuantity(products){

    let quantityError = false;
    let errorProduct;
 
    for(i = 0; i < products.length; i++){
        let product = products[i];

        let checkProductPromise = new Promise((resolve, reject) => {
            
            conn.query('SELECT name FROM products WHERE id = ? AND (quantity - ?) < 0', [product.id, product.quantity], (err, res) => {
                if(res.length > 0){
                    quantityError = true; 
                    errorProduct = res[0];
                }
                resolve();
            });
        });
        await checkProductPromise;
       
        if(quantityError) break;
    }

    return {error: quantityError, product: errorProduct};
}

async function updateProductsQuantity(products){

    for(i = 0; i < products.length; i ++){
        let product = products[i];

        let updateProductPromise = new Promise((resolve, reject) => {
            conn.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [product.quantity, product.id], (err, res) => {

                if(err) reject(err);

                resolve();
            });
        });

        await updateProductPromise;
    }
    
}

module.exports = {Order};