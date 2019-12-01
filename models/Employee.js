const {User} = require('./User');
const {conn} = require('./../db/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Employee extends User{

    constructor(obj){
        
        super(obj);

        this.salary = obj.salary;
        this.hiringDate = obj.hiringDate;

        this.userId = null;
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
    
               
            conn.query('DELETE FROM employee_tokens WHERE userId = ? AND type="auth"', this.userId, (err, res) => {
                if(err) throw err;

                conn.query('INSERT INTO employee_tokens SET ?', tokenObj, (err, res) => {
    
                    if(err) throw err;
    
                    resolve(token);
                });   
            });

             
        });
    }

    static findByCredentials(email, password, callback){

        conn.query('SELECT * FROM employees INNER JOIN users on employees.userId = users.id WHERE email = ?', email, function(err, rows){

            if(err || !rows.length)return callback(false);

            let employee = new Employee(rows[0]);
            
            bcrypt.compare(password, rows[0].password, (err, res) => {
                
                employee.password = null;
                employee.userId = rows[0].userId;
                
                if(res)
                    callback(employee);
                else
                    callback(false);
            });
        
        }); 
    }

    
    
    static findByToken(token){
        console.log(token);
        return new Promise((resolve, reject) => {
            let user = this;
            let decoded;
    
            try{
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            }catch(e){
                reject();
            }
    
            conn.query('SELECT * FROM employee_tokens t INNER JOIN users u ON t.userId = u.id WHERE t.token = ?', token, (err, rows) => {
                
                if(err) throw err;
    
                resolve(rows[0]);
            });
        });
    }
}

module.exports = {Employee};
