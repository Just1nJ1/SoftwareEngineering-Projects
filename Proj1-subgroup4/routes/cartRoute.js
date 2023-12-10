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

router.post('/validate-coupon', (req, res) => {
    const { couponCode } = req.body;
    const currentDate = new Date().toISOString().slice(0, 10); // Current date in YYYY-MM-DD format

    const sql = `SELECT * FROM Coupons WHERE code = ? AND is_active = TRUE 
                 AND valid_from <= ? AND valid_to >= ?`;

    db.query(sql, [couponCode, currentDate, currentDate], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            res.json({ success: false, error: err.message });
        } else {
            if (results.length > 0) {
                const coupon = results[0];
                res.json({ isValid: true, discountPercentage: coupon.discount_percentage });
            } else {
                res.json({ isValid: false });
            }
        }
    });
});

router.get('/tax-rate/:stateCode', (req, res) => {
    const { stateCode } = req.params;
    const sql = 'SELECT tax_rate FROM StateTaxes WHERE state_code = ?';

    db.query(sql, [stateCode], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            res.json({ success: false, error: err.message });
        } else {
            if (results.length > 0) {
                res.json({ success: true, taxRate: results[0].tax_rate });
            } else {
                res.json({ success: false });
            }
        }
    });
});



module.exports = router;
