require('./../config/config');

const expect = require('expect');
const request = require('supertest');

const mysql = require('mysql');
const {conn} = require('./../db/mysql');

const {Customer} = require('./../models/Customer'); 

const {app} = require('./../server');

function deleteAllUsers(callback){
    conn.query('DELETE FROM customers', (err) => {
        conn.query('DELETE FROM tokens', (err) => {
            conn.query('DELETE FROM users', (err) => {
                callback();
            });
        });
    });
}

let newCustomer = {
    email: 'teste@teste.com',
    password: '123456',
    name: 'teste',
    birthday: '16/10/1998',
    cpf: '16490962756'
};

describe('POST /customers', () => {

    beforeEach((done) => {
        deleteAllUsers(done);
    });
    
    it('should create a new user and return auth token', (done) => {
       
        request(app)
            .post('/customers')
            .send(newCustomer)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(newCustomer.email);
            })
            .end((err) => {
                if(err) return done(err);

                conn.query('SELECT * from customers c INNER JOIN users u on c.userId = u.id INNER JOIN tokens t on t.userId = u.id', function(err, rows){
                    if(err) return done(err);

                    let customer = rows[0];

                    expect(customer).toBeTruthy();
                    expect(customer.email).toBe(newCustomer.email);
                    expect(customer.cpf).toBe(newCustomer.cpf);
                    expect(customer.token).toBeTruthy();

                    done();
                });
            })
    });

    it('should give 400 status for invalid password length and should not create a new user', (done) => {
        let newInvalidCustomer = {
            email: 'teste@teste.com',
            password: '123',
            name: 'teste',
            birthday: '16/10/1998',
            cpf: '16490962756'
        }

         request(app)
            .post('/customers')
            .send(newInvalidCustomer)
            .expect(400)
            .end((err) => {
                if(err) return done(err);

                conn.query('SELECT * FROM customers', function(err, rows){
                    expect(rows.length).toBe(0);
                    done();
                });
            });
    });
});

describe('POST /customers/login', () => {

    beforeEach((done) => {
        deleteAllUsers(() => {

            request(app)
                .post('/customers')
                .send(newCustomer)
                .end(done);
        });
    })

    it('should authenticate successfuly and return a auth token', (done) => {

        request(app)
            .post('/customers/login')
            .send({
                email: newCustomer.email,
                password: newCustomer.password
            })
            .expect(200)
            .expect((res) => {

                expect(res.body.email).toBe(newCustomer.email);
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end(done);
    });

    it('should fail authentication and give status 401 forbidden', (done) => {

        request(app)
            .post('/customers/login')
            .send({
                email: newCustomer.email,
                password: 'senha incorreta'
            })
            .expect(401)
            .end(done);
    });
});
