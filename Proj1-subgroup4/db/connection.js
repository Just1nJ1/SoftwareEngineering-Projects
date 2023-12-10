const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Justin!01030',
    database: 'SE'
});

module.exports = pool;
