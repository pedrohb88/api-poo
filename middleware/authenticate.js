let {Customer} = require('./../models/Customer');
let {Employee} = require('./../models/Employee');
var _ = require('lodash');

let authenticateCustomer = (req, res, next) => {
    let token = req.header('x-auth') || req.body['x-auth'];

    Customer.findByToken(token).then((user) => {
        if(!user)
            return Promise.reject();
        
        req.user = _.pick(user, ['id', 'userId', 'email', 'name', 'birthday', 'phone']);
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send('Falha na autenticação');
    });
}

let authenticateEmployee = (req, res, next) => {
    let token = req.header('x-auth') || req.body['x-auth'];

    Employee.findByToken(token).then((user) => {
        if(!user)
            return Promise.reject();
        
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send('Falha na autenticação');
    });
}
 

module.exports = {authenticateCustomer, authenticateEmployee};