const http = require('http');
const url = require('url');
const fs = require('fs');
const cors = require('cors');

let cart = [];
let wishlist = [];
let recommendations = []; // List of product recommendations
let products = []; // List of products
let productIdCounter = 1; // Initializing the product ID counter

const dataPath = './data.json';

// Load data from the file if it exists
if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, 'utf-8');
    const parsedData = JSON.parse(data);
    products = parsedData.products || [];
    cart = parsedData.cart || {};
    wishlist = parsedData.wishlist || {};
}

// Function to save data to the file
const saveData = () => {
    const data = JSON.stringify({ products, cart, wishlist });
    fs.writeFileSync(dataPath, data, 'utf-8');
};

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname.toLowerCase(); 
    const method = req.method;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	
   
    cors();
	
    if (path === '/api/products' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productDetails = JSON.parse(body);
            const newProduct = {
                id: productIdCounter, 
                name: productDetails.name,
                image: productDetails.image,
                price: productDetails.price,
                details: productDetails.details
            };
            products.push(newProduct);
            productIdCounter++; 
            saveData();
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Product added successfully.');
        });
    } else if (path === '/api/products' && method === 'DELETE') {
        products = []; 
        saveData();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('All products deleted successfully.');
    } else if (path.startsWith('/api/products/') && method === 'DELETE') {
        const parts = path.split('/');
        const productId = parts[3]; 
        const index = products.findIndex(item => item.id == productId); 
        if (index !== -1) {
            products.splice(index, 1);
            saveData();
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Product deleted successfully.');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Product not found');
        }
    }else if (path.startsWith('/api/products/') && method === 'GET') {
        const parts = path.split('/');
        const productId = parts[3]; 
        const product = products.find(item => item.id === parseInt(productId)); 
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Product not found');
        }
    }else if (path === '/api/cart' && method === 'POST') {      //3.2 Add to Cart
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const cartData = JSON.parse(body);
            const userId = cartData.userId;
            const productId = cartData.productId;
            const quantity = cartData.quantity;
            if (!cart[userId]) {
                cart[userId] = {};
            }
            cart[userId][productId] = quantity;
            saveData();
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Product added to cart successfully.');
        });
    } else if (path === '/api/wishlist' && method === 'POST') {        //3.1 Add to Wishlist
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const wishlistData = JSON.parse(body);
            const userId = wishlistData.userId;
            const productId = wishlistData.productId;
            if (!wishlist[userId]) {
                wishlist[userId] = [];
            }
            wishlist[userId].push(productId);
            saveData();
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Product added to wishlist successfully.');
        });
    } else if (path === '/api/cart/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productDetails = JSON.parse(body);
            cart.push(productDetails);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Product added to cart successfully.');
        });
    } else if (path === '/api/cart/update' && method === 'PUT') {              //3.3 Update Cart
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const modifiedProduct = JSON.parse(body);
            const productIndex = cart.findIndex(item => item.id === modifiedProduct.id);
            if (productIndex !== -1) {
                cart[productIndex].quantity = modifiedProduct.quantity;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Product quantity in cart updated successfully.');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Product not found in the cart.');
            }
        });
    } else if (path === '/api/cart/remove' && method === 'DELETE') {          //3.4 Remove items from Cart
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productId = JSON.parse(body).id;
            const index = cart.findIndex(item => item.id === productId);
            if (index !== -1) {
                cart.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Product removed from cart successfully.');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Product not found in the cart.');
            }
        });
    } else if (path === '/api/wishlist/add' && method === 'POST') {          //3.1 Add to Wishlist
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productDetails = JSON.parse(body);
            wishlist.push(productDetails);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Product added to wishlist successfully.');
        });
    } else if (path === '/api/wishlist/remove' && method === 'DELETE') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productId = JSON.parse(body).id;
            const index = wishlist.findIndex(item => item.id === productId);
            if (index !== -1) {
                wishlist.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Product removed from wishlist successfully.');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Product not found in the wishlist.');
            }
        });
    } else if (path === '/api/wishlist/addToCart' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const productId = JSON.parse(body).id;
            const product = wishlist.find(item => item.id === productId);
            if (product) {
                cart.push(product);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Product added to cart from wishlist successfully.');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Product not found in the wishlist.');
            }
        });
    } else if (path === '/api/cart' && method === 'GET') {                 //3.5 View Cart
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(Object.values(cart)));
    } else if (path === '/api/wishlist' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(Object.values(wishlist)));
    } else if (path === '/api/recommendations/view' && method === 'GET') {    //3.6 View Recommendations
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(recommendations));
    } else if (path === '/api/notifications/send' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Notification sent successfully.');
        });
    } else if (path === '/api/products/:id' && method === 'GET') {
        const productId = reqUrl.query.id; 
        const product = products.find(item => item.id === productId);
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Product not found');
        }
    } else if (path === '/api/products' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    }else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

