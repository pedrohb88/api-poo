const {User} = require('./User');
const {conn} = require('./../db/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {Address} = require('./Address');
const {Document} = require('./Document');
const {PaymentMethod} = require('./PaymentMethod');
const _ = require('lodash');

class Customer extends User{

    constructor(obj){
        
        super(obj);

        this.customerSince = new Date();
        this.address = obj.address;
        this.document = obj.document;
        this.paymentMethod = obj.paymentMethod;

        this.userId = obj.userId ? obj.userId:null;
    }

    generateAuthToken(){
        return new Promise((resolve, reject) => {
            let token = jwt.sign({
                id: this.userId,
                type: 'auth'
            }, process.env.JWT_SECRET).toString();
    
            let tokenObj = {
                userId: this.userId,
                type: 'auth',
                token
            }
    
               
            conn.query('DELETE FROM tokens WHERE userId = ?', this.userId, (err, res) => {
                if(err) throw err;

                conn.query('INSERT INTO tokens SET ?', tokenObj, (err, res) => {
    
                    if(err) throw err;
    
                    resolve(token);
                });   
            });

             
        });
    }

    register(password){
        return new Promise((resolve, reject) => {
            this.validatePassword(password).then(() => {
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {

                        this.password = hash;

                        let user = {
                            name: this.name,
                            email: this.email,
                            birthday: this.birthday,
                            password: hash,
                            cpf: this.cpf,
                            phone: this.phone
                        };
                    
                        conn.query('INSERT INTO users SET ?', user, (err, res) => {

                            if(err) throw err;

                            let userId = res.insertId;
                            let addressId;
                            let documentId;
                            let paymentMethodId;

                             conn.query('INSERT INTO addresses SET ?', this.address, (err, res) => {
                                if(err) throw err;

                                addressId = res.insertId;
                                conn.query('INSERT INTO documents SET ?', this.document, (err, res) => {
                                    if(err) throw err;

                                    documentId = res.insertId;

                                    conn.query('INSERT INTO payment_methods SET ?', this.paymentMethod, (err, res) => {
                                        if(err) throw err;

                                        paymentMethodId = res.insertId;

                                        this.userId = userId;
                                        let customer = {
                                            userId,
                                            customerSince: this.customerSince,
                                            address: addressId,
                                            document: documentId,
                                            paymentMethodId
                                        }
    
                                        conn.query('INSERT INTO customers SET ?', customer, (err, res) => {
            
                                            if(err) throw err;
            
                                            this.id = res.insertId;
                                            
                                            this.generateAuthToken().then((token) => {
                                                resolve(token);
                                            });                                
                                        });
                                    });
                                })
                            });
                        });
                    });
                });

            }).catch((e) => {
                reject(e);
            });
        });
    }

    async updateInfo(info, token){
        
            info = _.omit(info, ['id', 'userId', 'type', 'token', 'customerSince']);
    
            if(info.address){
                let query = 'UPDATE addresses SET ';
                let i = 0;
                let paramsArr = [];
                Object.keys(info.address).forEach((key) => {
                    if(i!=0) query += ',';
    
                    query += `${key}=?`;
                    paramsArr.push(info.address[key]);
                    i++;
                });
    
                query += 'WHERE id=?';
                paramsArr.push(this.address);
    
                let updateAddressPromise = new Promise((resolve, reject) => {
                    conn.query(query, paramsArr, (err, res) => {
                        if(err) return reject(err);
    
                        resolve();
                    });
                });
    
                await updateAddressPromise;
            }
    
            if(info.document){
                let query = 'UPDATE documents SET ';
                let i = 0;
                let paramsArr = [];
                Object.keys(info.document).forEach((key) => {
                    if(i!=0) query += ',';
    
                    query += `${key}=?`;
                    paramsArr.push(info.document[key]);
                    i++;
                });
    
                query += 'WHERE id=?';
                paramsArr.push(this.document);
    
                let updateDocumentPromise = new Promise((resolve, reject) => {
                    conn.query(query, paramsArr, (err, res) => {
                        if(err) return reject(err);
    
                        resolve();
                    });
                });
    
                await updateDocumentPromise;
            }
    
            if(info.paymentMethod){
                let query = 'UPDATE payment_methods SET ';
                let i = 0;
                let paramsArr = [];
                Object.keys(info.paymentMethod).forEach((key) => {
                    if(i!=0) query += ',';
    
                    query += `${key}=?`;
                    paramsArr.push(info.paymentMethod[key]);
                    i++;
                });
    
                query += 'WHERE id=?';
                paramsArr.push(this.paymentMethod);
    
                let updatePaymentPromise = new Promise((resolve, reject) => {
                    conn.query(query, paramsArr, (err, res) => {
                        if(err) return reject(err);
    
                        resolve();
                    });
                });
    
                await updatePaymentPromise;
            }
    
            info = _.omit(info, ['address', 'document', 'paymentMethod']);
         
            let query = 'UPDATE users SET ';
            let i = 0;
            let paramsArr = [];
            Object.keys(info).forEach((key) => {
                if(i!=0) query += ',';
    
                query += `${key}=?`;
                paramsArr.push(info[key]);
                i++;
            });
    
            query += 'WHERE id=?';
            paramsArr.push(this.userId);
         
            let updateUserPromise = new Promise((resolve, reject) => {
                conn.query(query, paramsArr, function(err, res) {
                    if(err) return reject(err);

                    resolve();
                });
            });
    
            await updateUserPromise;
         
            let customer = null;
            let findUserPromise = new Promise((resolve, reject) => {
                Customer.findByToken(token).then((c) => {
                    customer = c;
                    resolve();
                }).catch((e) => resolve());
            }); 

            await findUserPromise;

            return customer;
    }

    static findByCredentials(email, password, callback){

        conn.query('SELECT * FROM customers INNER JOIN users on customers.userId = users.id WHERE email = ?', email, function(err, rows){

            if(err || !rows.length)return callback(false);

            let customer = new Customer(rows[0]);
            
            bcrypt.compare(password, rows[0].password, (err, res) => {
                
                customer.password = null;
                customer.userId = rows[0].userId;
                
                if(res)
                    callback(customer);
                else
                    callback(false);
            });
        
        }); 
    }

    
    static findByToken(token){
        return new Promise((resolve, reject) => {
            let user = this;
            let decoded;
    
            try{
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            }catch(e){
                reject();
            }
    
            conn.query('SELECT * FROM tokens t INNER JOIN users u ON t.userId = u.id INNER JOIN customers c ON u.id = c.userId WHERE t.token = ?', token, (err, rows) => {
                
                if(err) throw err;
    
                resolve(rows[0]);
            });
        });
    }
}

module.exports = {Customer};
