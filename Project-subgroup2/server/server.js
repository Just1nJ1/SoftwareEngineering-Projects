const http = require('http');
const mysql = require('mysql');
const fs = require('fs');

const port = 8000;
const dbCon = mysql.createConnection({
  //local database, change it to yourself
  host: 'localhost',
  user: 'root',
  password: 'group7',
  database: 'shopease',
});

dbCon.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  }
  console.log('Connected to MySQL');
});

// HTTP request part of the URI that routes the server actions
const regExpProduct = new RegExp ('^\/api\/products\/.*', 'i');
const regExpReviews = new RegExp ('^\/api\/reviews\/.*', 'i');
const regExpProductManagement = new RegExp ('^\/administrator\/productManagement.*', 'i');
const regExpAddProduct = new RegExp ('^\/api\/addProduct.*', 'i');

function applicationServer(request, response) {
  let urlParts = [];
  let segments = request.url.split('/');
  for (let i = 0, num = segments.length; i < num; i++) {
    if (segments[i] !== '') {
      urlParts.push(segments[i]);
    }
  }

  if (request.url === '/api') {
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
  } else if (regExpProduct.test(request.url) && urlParts[2] !== null) {
      fetchProductsDetail(urlParts,(err, productDetailResult) => {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        } else if (!productDetailResult) {
            //the resource itself does not exist
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end("Page Not Found");
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
  } else if (regExpReviews.test(request.url) && urlParts[2] !== null) {
      fetchAllReviews(urlParts,(err, reviewsResult) => {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        } 
          else if (!reviewsResult)
          {
            //the resource itself does not exist
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end("Page Not Found");
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
      });
  } else if (regExpProductManagement.test(request.url) && request.method === 'GET') { 
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
        } else {
            response.writeHead(401, { 'Content-Type': 'text/plain' });
            response.end('Unauthorized');
        }
  } else if (regExpAddProduct.test(request.url) && request.method === 'POST') {
  productManage(request, response);
  } else {
      //the URL is not recognized
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end("Page Not Found");
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
  const ProductID = urlParts[2];
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
  const ProductID = urlParts[2];
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
  const ProductID = urlParts[2];
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
    try { 
      data = Buffer.concat(data).toString();
      const productData = JSON.parse(data);
      // Verify received parameters
      if (
        !productData.Name ||
        !productData.Price ||
        !productData.Description ||
        !productData.StockInventory
      ) {
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.end('Bad Request: Missing required parameters');
        return;
      }
      // Check if product name already exists
      const checkQuery = 'SELECT * FROM Product WHERE Name = ?';
      dbCon.query(checkQuery, [productData.Name], (checkErr, checkResults) => {
        if (checkErr) {
          console.error('Error checking product name:', checkErr);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        } else if (checkResults.length > 0) {
            // Product name already exists
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Product name already exists');
        } else {
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
          }
      });
    }
    catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Bad Request: Invalid JSON' }));
    }
  });
}
const webServer = http.createServer(applicationServer);
webServer.listen(port);
