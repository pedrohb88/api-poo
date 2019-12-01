const jwt = require('jsonwebtoken');
const {conn} = require('./../db/mysql');

class User{
    constructor(obj){

        if(new.target === User) throw new TypeError('Essa classe não pode ser instanciada diretamente');

        this.name = obj.name;
        this.email = obj.email;
        this.birthday = obj.birthday;
        this.cpf = obj.cpf;
        this.phone = obj.phone;

        this.id = null;
        this.password = null;
    }

    
    validatePassword(pass){
        return new Promise((resolve, reject) => {
            let passMinLength = 6;

            if(!pass) reject('Senha não enviada.');
    
            if(pass.length < passMinLength) reject(`A senha deve ter pelo menos ${passMinLength} dígitos.`);

            resolve();
        });
    }
}

module.exports = {User}