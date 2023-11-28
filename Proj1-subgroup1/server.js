const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456', //local database password, change it io your own local password
    database: 'shopeadb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function registerAPI(req, res){
    try{
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const data = JSON.parse(body);
        const { email, password, username, phone_number, address} = data;

        // Check if the email already exists in the database
        pool.query('SELECT * FROM accountinfo WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error occurred while registering user.' }));
            } else {
                if (results.length > 0) {
                    // Email already exists, return an error
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Email already exists. Please choose a different email.' }));
                } else {
                    pool.query('SELECT * FROM accountinfo WHERE username = ?', [username], (error, results)=>{
                        
                        if(error){
                            console.error('error: ', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Error occurred while registering user.' }));
                        }else{
                            if (results.length > 0) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'username already exists. Please choose a different username.' }));
                                }else{
                                    pool.query('INSERT INTO accountinfo (email, password, username, phone_number, address) VALUES (?, ?, ?, ?, ?)', [email, password, username, phone_number, address], (error, results) => {
                                        if (error) {
                                            console.error('Error:', error);
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ message: 'Error occurred while registering user.' }));
                                        } else {
                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ message: 'User registered successfully!' }));
                                }
                            });
                            }
                        }
                    })
                
                    // Email is unique, perform the insert operation
                    
                }
            }
        });
    });}catch(error){
        console.error('Error parsing JSON:', error);
    }
} //function api calls end here

function loginAPI(req, res){
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);
            const { email, password } = data;

            // Perform login validation and authentication here
            // Check if the provided email and password match a user in your database
            // If successful, generate and return a token or session for the user

            pool.query('SELECT * FROM accountinfo WHERE email = ?', [email], (error, results) => {
                if (error) {
                    console.error('Error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'An error occurred during login.' }));
                } else {
                    if (results.length > 0) {
                        const user = results[0];

                        // Check if the provided password matches the user's password
                        if (user.password === password) {
                            // Login successful
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login successful' }));
                        } else {
                            // Password is incorrect
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Incorrect password' }));
                        }
                    } else {
                        // User does not exist
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'User not found' }));
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}

function changepasswordAPI(req, res){
    let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Convert Buffer to string
        });
    
        req.on('end', () => {
            try {
                const { email, old_password, new_password, repeat_password } = JSON.parse(body);
    
                //console.log(`Received: ${email}, ${old_password}, ${new_password}, ${repeat_password}`); // Log received data for debugging
    
                // Check if new passwords match
                if (new_password !== repeat_password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'New passwords do not match.' }));
                    return;
                }
    
                // Retrieve the user from the database
                pool.query('SELECT * FROM accountinfo WHERE email = ?', [email], (error, results) => {
                    if (error || results.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'User not found.' }));
                        return;
                    }
    
                    const user = results[0];
                    //console.log(`DB password for ${email}: ${user.password}`); // Log DB password for debugging
    
                    // Check if the old password matches the one in the database
                    if (user.password !== old_password.trim()) {
                        // Old password does not match
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Old password is incorrect.' }));
                        return;
                    }
    
                    // Old password matches, so update with the new password
                    pool.query('UPDATE accountinfo SET password = ? WHERE email = ?', [new_password, email], (updateError) => {
                        if (updateError) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Error updating password in the database.' }));
                            return;
                        }
    
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Password changed successfully.' }));
                    });
                });
            } catch (jsonError) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request - Invalid JSON format.' }));
            }
        });
}
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept');
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/api/login') {
        // Serve the index.html file for the root route
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/api/signup') { //pathname === '/signup.html'
        // Serve the signup.html file for the signup route
        const filePath = path.join(__dirname, 'signup.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/api/dashboard') {
        const filePath = path.join(__dirname, 'dashboard.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    
    } else if (pathname === '/api/changepassword') {
        const filePath = path.join(__dirname, 'changepassword.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });

    } else if (req.method === 'POST' && pathname === '/register') { //Zhihang Liu
        registerAPI(req, res)
    } else if (req.method === 'POST' && pathname === '/login') { //Rui Zhang
        loginAPI(req, res)
    } else if (req.method === 'PUT' && pathname === '/changepassword') { //Yi Tang
        changepasswordAPI(req, res)
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
})
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});