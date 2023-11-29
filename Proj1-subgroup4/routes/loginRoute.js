const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db.js');

// Database connection
const db = mysql.createConnection(dbConfig);

router.post('/', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Customer WHERE Username = ? AND Password = ?';

    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // Store user's ID in session
            req.session.userId = result[0].CustomerID;
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

module.exports = router;