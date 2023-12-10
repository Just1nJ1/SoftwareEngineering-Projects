const express = require('express');
const router = express.Router();

router.post('/api/store-cart-ids', (req, res) => {
    const { cartIds, productIDs, NUMBERs } = req.body;
    req.session.cartIds = cartIds;
    req.session.productIDs = productIDs;
    req.session.NUMBERs = NUMBERs;
    req.session.totalAmount = req.body.totalAmount; // Store total amount in session
    res.json({ success: true });
});

module.exports = router;
