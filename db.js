const mysql = require('mysql')

const db = mysql.createConnection({
    user: 'sql12594110',
    host: 'sql12.freesqldatabase.com',
    password: 'rWnt8pn4Dv',
    database: 'sql12594110',
});

module.exports = db;