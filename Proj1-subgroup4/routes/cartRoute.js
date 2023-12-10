const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db.js');

const db = mysql.createConnection(dbConfig);
router.get('/', (req, res) => {
    const customerId = req.session.userId;

    const sql = `SELECT c.CartID, c.NUMBER, c.ProductID, p.Name, p.Price, p.Description 
                 FROM Cart c 
                 JOIN Product p ON c.ProductID = p.ProductID 
                 WHERE c.CustomerID = ?`;

    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            res.json({ success: false, error: err.message });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
