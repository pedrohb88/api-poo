const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if(err){
        console.log('Erro ao conectar ao banco de dados: ' + err.sqlMessage);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso');

});

module.exports = {conn};