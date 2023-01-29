const mysql = require('mysql')

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'doantotnghiep',
});

module.exports = db;