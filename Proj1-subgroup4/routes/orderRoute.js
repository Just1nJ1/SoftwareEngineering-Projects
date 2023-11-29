const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db.js');

// Database connection
const db = mysql.createConnection(dbConfig);

router.get('/', (req, res) => {
    const sql = `
        SELECT o.OrderID, o.CustomerID, o.ProductIDs, o.NUMBERs, 
               SUM(p.Price * FIND_IN_SET(p.ProductID, o.ProductIDs)) AS Total 
        FROM Orders o
        JOIN Product p ON FIND_IN_SET(p.ProductID, o.ProductIDs)
        GROUP BY o.OrderID
    `;

    db.query(sql, (err, results) => {
        console.log("Database Query Results:", results); 
        if (err) throw err;
        res.json(results.map(order => ({
            ...order,
            Total: parseFloat(order.Total).toFixed(2) // Formatting total as a decimal
        })));
    });
});

router.delete('/cancel/:orderId', (req, res) => {
    const { orderId } = req.params;
    const sql = 'DELETE FROM Orders WHERE OrderID = ?';

    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error(err);
            res.json({ success: false });
        } else {
            console.log(`Order ID ${orderId} cancelled`); // Debug: Confirm order cancellation
            res.json({ success: true });
        }
    });
});

module.exports = router;
