const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db.js');

const db = mysql.createConnection(dbConfig);

// Regular expression for MM/YY format
const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

router.post('/', (req, res) => {
    const { billingAddress, cardNumber, expiryDate, cvv } = req.body;
    const customerId = req.session.userId;

    // Validate expiry date format
    if (!expiryDateRegex.test(expiryDate)) {
        return res.json({ success: false, message: 'Invalid expiry date format' });
    }

    const sql = 'INSERT INTO PaymentInfo (CustomerID, BillingAddress, CardNumber, ExpiryDate, CVV) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [customerId, billingAddress, cardNumber, expiryDate, cvv], (err, result) => {
        if (err) {
            res.json({ success: false });
            console.error(err);
        } else {
            const paymentId = result.insertId;
            const cartIds = req.session.cartIds.join(','); // Assuming cartIds is an array
            const productIDs = req.session.productIDs.join(','); // Assuming cartIds is an array
            const NUMBERs = req.session.NUMBERs.join(','); // Assuming cartIds is an array

            // Insert into Orders table
            const orderSql = 'INSERT INTO Orders (CustomerID, PaymentInfoID, ProductIDs, NUMBERs) VALUES (?, ?, ?, ?)';
            db.query(orderSql, [customerId, paymentId, productIDs, NUMBERs], (err) => {
                if (err) {
                    res.json({ success: false });
                    console.error(err);
                } else {
                    // Optionally, remove items from Cart table
                    const removeCartItemsSql = 'DELETE FROM Cart WHERE CartID IN (?)';
                    db.query(removeCartItemsSql, [cartIds.split(',')], (err) => {
                        if (err) {
                            res.json({ success: false });
                            console.error(err);
                        } else {
                            req.session.cartIds = []; // Clear cartIds from session
                            res.json({ success: true });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
