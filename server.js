const http = require('http');
const mysql = require('mysql');
const fs = require('fs');

const port = 8000;
const dbCon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'group7',
  database: 'goods',
});

dbCon.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  }
  console.log('Connected to MySQL');
});

function applicationServer(request, response) {
  let urlParts = [];
  let segments = request.url.split('/');
  for (let i = 0, num = segments.length; i < num; i++) {
    if (segments[i] !== '') {
      urlParts.push(segments[i]);
    }
  }

  if (request.url === '/') {
    fetchTopSellingProducts((err, bestSellingResults) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
        fetchLatestProducts((err, lastProductResults) => {
          if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
          } else {
            // Serve the HTML page with data
            fs.readFile('homepage.html', (err, data) => {
              if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
              } else {
                const htmlWithData = data.toString()
                  .replace(
                    '<!-- bestSellingProducts -->',
                    JSON.stringify(bestSellingResults)
                  )
                  .replace(
                    '<!-- lastProductResults -->',
                    JSON.stringify(lastProductResults)
                  );
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(htmlWithData);
              }
            });
          }
        });
      }
    });
  } else if (urlParts[0] === 'products' && urlParts[1] !== null) {
  fetchProductsDetail(urlParts,(err, productDetailResult) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
      fetchProductReview(urlParts,(err, lastReviewResult) => {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        } else {
          // Serve the HTML page with data
          fs.readFile('specificproduct.html', (err, data) => {
            if (err) {
              response.writeHead(500, { 'Content-Type': 'text/plain' });
              response.end('Internal Server Error');
            } else {
              const htmlWithData = data.toString()
                .replace(
                  '<!-- productsDetail -->',
                  JSON.stringify(productDetailResult)
                )
                .replace(
                  '<!-- productReviews -->',
                  JSON.stringify(lastReviewResult)
                );
              response.writeHead(200, { 'Content-Type': 'text/html' });
              response.end(htmlWithData);
            }
          });
        }
      });
    }
  });
}
else if (urlParts[0] === 'reviews' && urlParts[1] !== null) {
  fetchAllReviews(urlParts,(err, reviewsResult) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        } else {
          // Serve the HTML page with data
          fs.readFile('reviews.html', (err, data) => {
            if (err) {
              response.writeHead(500, { 'Content-Type': 'text/plain' });
              response.end('Internal Server Error');
            } else {
              const htmlWithData = data.toString()
                .replace(
                  '<!-- reviews -->',
                  JSON.stringify(reviewsResult)
                );
              response.writeHead(200, { 'Content-Type': 'text/html' });
              response.end(htmlWithData);
            }
          });
        }
    }    
  });
}
else if (request.url === '/administrator/productManagement' && request.method === 'GET') {
  // Serve the product management web page
  //This page needs to verify the user identity first and is supported by other groups. It is assumed to be true here.
  const identifyResult = true;
  if (identifyResult) {  
    fs.readFile('productManagement.html', (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(data);
    }
  });
}
else 
{
  response.writeHead(401, { 'Content-Type': 'text/plain' });
  response.end('Unauthorized');
}
}
else if (request.url === '/api/addProduct' && request.method === 'POST') {
  productManage(request, response);
}
else {
//we will add other function later
response.writeHead(200, { 'Content-Type': 'text/html' });
response.end("we will add other function later");
}
}
// Fetch top 10 best-selling products
function fetchTopSellingProducts(callback) {
  const bestSellingQuery = 'SELECT * FROM Product ORDER BY SalesNumber LIMIT 10';
  dbCon.query(bestSellingQuery, (err, results) => {
    if (err) {
      console.error('Error fetching best-selling products:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}
// Fetch 5 latest products added
function fetchLatestProducts(callback) {
  const lastProductQuery = 'SELECT * FROM Product ORDER BY ProductID DESC LIMIT 5';
  dbCon.query(lastProductQuery, (err, results) => {
    if (err) {
      console.error('Error fetching latest products:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}
// Fetch product detail
function fetchProductsDetail(urlParts, callback){
  let sqlStatement;
  const ProductID = urlParts[1];
    sqlStatement = 'SELECT * FROM Product WHERE ProductID = ?';
    dbCon.query(sqlStatement, [ProductID], (err, results) => {
    if (err) {
      console.error('Error retrieving product detail:', err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
    });
}
// Fetch 5 last product reviews
function fetchProductReview(urlParts, callback){
  let sqlStatement;
  const ProductID = urlParts[1];
  sqlStatement = 'SELECT * FROM Review WHERE ProductID = ? ORDER BY ReviewID DESC LIMIT 5';
  dbCon.query(sqlStatement, [ProductID], function (err, results) {
    if (err) {
      console.error('Error retrieving reviews:', err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  });
}
// Fetch specific product all reviews
function fetchAllReviews(urlParts, callback){
  let sqlStatement;
  const ProductID = urlParts[1];
  // sqlStatement = 'SELECT * FROM Review WHERE ProductID = ?';
  sqlStatement = 'SELECT Review.*, Product.Name AS ProductName FROM Review JOIN Product ON Review.ProductID = Product.ProductID WHERE Review.ProductID = ?';
  dbCon.query(sqlStatement, [ProductID], function (err, results) {
    if (err) {
      console.error('Error retrieving reviews:', err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  }); 
}
// Fetch product Management
function productManage(request, response){
  // Handle product insertion
  let data = [];
  request.on('data', chunk => {
      data.push(chunk);
  });
  request.on('end', () => {
      data = Buffer.concat(data).toString();
      const productData = JSON.parse(data);

      // Insert the product data into the database
      const insertQuery = 'INSERT INTO Product (Name, Price, Description, StockInventory) VALUES (?, ?, ?, ?)';
      const values = [productData.Name, productData.Price, productData.Description, productData.StockInventory];

      dbCon.query(insertQuery, values, (err, result) => {
          if (err) {
              console.error('Error adding product:', err);
              response.writeHead(500, { 'Content-Type': 'text/plain' });
              response.end('Internal Server Error');
          } else {
              response.writeHead(200, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({ message: 'Product added successfully' }));
          }
      });
  });
}
const webServer = http.createServer(applicationServer);
webServer.listen(port);
