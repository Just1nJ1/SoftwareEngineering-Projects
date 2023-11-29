const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dbConfig = require('./config/db.js');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your_secret_key', // Secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database connection
const db = mysql.createConnection(dbConfig);
const loginRoute = require('./routes/loginRoute');
const cartRoute = require('./routes/cartRoute');
const paymentRoute = require('./routes/paymentRoute');
const storeCartIdsRoute = require('./routes/store2session');
app.use('/api/login', loginRoute);
app.use('/api/cart', cartRoute);
app.use('/api/payment', paymentRoute);
app.use(storeCartIdsRoute);

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
