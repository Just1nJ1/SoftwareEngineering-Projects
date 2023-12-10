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
const regExpUpdateProduct = new RegExp ('^\/api\/updateProduct\/.*', 'i');
const regExpCategory = new RegExp ('^\/api\/products\/category\/.*', 'i');


function applicationServer(request, response) {
  let urlParts = [];
  let segments = request.url.split('/');
  for (let i = 0, num = segments.length; i < num; i++) {
    if (segments[i] !== '') {
      urlParts.push(segments[i]);
    }
  }
  if (request.url === '/navbar.html') {
    fs.readFile('navbar.html', (err, data) => {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        }
    });
    return;
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
                      )
                      .replace(
                        '<link rel="import" href="/navbar.html">',
                        '' 
                    );
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(htmlWithData);
                  }
                });
            }
          });
      }
    });
  } else if (regExpProduct.test(request.url) && urlParts[2] !== null  && urlParts[3] == null) {
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
      const SupplierID = 1;
        if (SupplierID == 1) {           
          fetchProductsBySupplier(SupplierID, (err, products) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
            } else {
                fs.readFile('productManagement.html', (err, data) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end('Internal Server Error');
                    } else {
                        const htmlWithData = data.toString()
                            .replace(
                              '<!-- productSupplierList -->',
                                JSON.stringify(products)
                            );
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(htmlWithData);
                    }
                });
            }
        });
        } else {
            response.writeHead(401, { 'Content-Type': 'text/plain' });
            response.end('Unauthorized');
        }
  } else if (regExpAddProduct.test(request.url) && request.method === 'POST') {
      // Serve the product management web page
      //This page needs to verify the user identity first and is supported by other groups. It is assumed to be true here.
      const SupplierID = 1;
        if (SupplierID == 1) { 
          addProduct(request, response);
        }
  } else if (regExpUpdateProduct.test(request.url)  &&  urlParts[2] !== null) {
      if (request.method === 'GET') {
        const SupplierID = 1;
        if (SupplierID == 1) {           
          fetchProductsDetail(urlParts, (err, products) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
            } else {
                fs.readFile('updateProduct.html', (err, data) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end('Internal Server Error');
                    } else {
                        const htmlWithData = data.toString()
                            .replace(
                              '<!-- productData -->',
                                JSON.stringify(products)
                            );
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(htmlWithData);
                    }
                });
            }
        });
        } else {
            response.writeHead(401, { 'Content-Type': 'text/plain' });
            response.end('Unauthorized');
        }
      } else if (request.method === 'PUT') {
          updateProduct(urlParts,request, response);
      } else if (request.method === 'DELETE') {
        deleteProduct(urlParts,request, response);
      }

  } else if (regExpCategory.test(request.url) && urlParts[3] !== null) {
    fetchProductsCategory(urlParts, (err, categoryResult) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error1');
      } 
        else if (!categoryResult)
        {
          //the resource itself does not exist
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end("Page Not Found");
        } else {
            // Serve the HTML page with data
            fs.readFile('category.html', (err, data) => {
              if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error2');
              } else {
                  const htmlWithData = data.toString()
                    .replace(
                      '<!-- categoryProducts -->',
                      JSON.stringify(categoryResult)
                    );
                  response.writeHead(200, { 'Content-Type': 'text/html' });
                  response.end(htmlWithData);
              }
            });
          }  
    });
  } else if (request.url.startsWith('/search') && request.method === 'GET') {
    const urlParts = request.url.split('?');
    const query = new URLSearchParams(urlParts[1]);
    const keyword = query.get('query');
    const priceFilter = query.get('priceFilter');
    const ratingFilter = query.get('ratingFilter');
    fetchProductsSearch(keyword, priceFilter, ratingFilter, (err, searchResult) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
            // Serve the HTML page with data
            fs.readFile('searchResults.html', (err, data) => {
              if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
              } else {
                  const htmlWithData = data.toString()
                    .replace(
                      '<!-- searchProducts -->',
                      JSON.stringify(searchResult)
                    );
                  response.writeHead(200, { 'Content-Type': 'text/html' });
                  response.end(htmlWithData);
              }
            });
          }  
    });
  }

  else {
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
function fetchProductsDetail(urlParts, callback) {
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
function fetchProductReview(urlParts, callback) {
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
function fetchAllReviews(urlParts, callback) {
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
// Add product
function addProduct(request, response) {
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
            const sqlStatement  = 'INSERT INTO Product (Name, Price, Description, StockInventory, SupplierID) VALUES (?, ?, ?, ?, 1)';
            const values = [productData.Name, productData.Price, productData.Description, productData.StockInventory];

            dbCon.query(sqlStatement , values, (err, result) => {
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
//Update product
function updateProduct(urlParts,request, response) {
  let data = [];
  const ProductID = urlParts[2];
  request.on('data', chunk => {
    data.push(chunk);
  });
  request.on('end', () => {
    try {
      data = Buffer.concat(data).toString();
      const productData = JSON.parse(data);
      // Check if product name already exists (excluding the current product being updated)
      const checkQuery = 'SELECT * FROM Product WHERE Name = ? AND ProductID != ?';
      dbCon.query(checkQuery, [productData.Name, ProductID], (checkErr, checkResults) => {
        try {
          if (checkErr) {
            console.error('Error checking product name:', checkErr);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
          } else if (checkResults.length > 0) {
            // Product name already exists
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Product name already exists');
          } else {
            // Update the product data in the database
            const sqlStatement =
              'UPDATE Product SET Name = ?, Price = ?, Description = ?, StockInventory = ? WHERE ProductID = ?';
            const values = [
              productData.Name,
              productData.Price,
              productData.Description,
              productData.StockInventory,
              ProductID,
            ];
            dbCon.query(sqlStatement, values, (err, result) => {
              if (err) {
                console.error('Error updating product:', err);
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
              } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Product updated successfully' }));
              }
            });
          }
        } catch (error) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Bad Request: Error in processing product update' }));
        }
      });
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Bad Request: Invalid JSON' }));
    }
  });
}
// Fetch products by supplier
function fetchProductsBySupplier(supplierID, callback) {
  const sqlStatement = 'SELECT * FROM Product WHERE SupplierID = ?';
  dbCon.query(sqlStatement, [supplierID], (err, results) => {
      if (err) {
          console.error('Error fetching products by supplier:', err);
          callback(err, null);
      } else {
        callback(null, results);
      }
  });
}
// Function to delete a product
function deleteProduct(urlParts,request, response) {
  const ProductID = urlParts[2];
  const sqlStatement = 'DELETE FROM Product WHERE ProductID = ?';
  dbCon.query(sqlStatement, [ProductID], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Product deleted successfully' }));
    }
  });
}
// Fetch category products
function fetchProductsCategory(urlParts, callback) {
  let sqlStatement;
  const CatrgoryID = urlParts[3];
    sqlStatement = 'SELECT * FROM Product WHERE CategoryID = ? ';
    dbCon.query(sqlStatement, [CatrgoryID], (err,results) => {
      if (err) {
        console.error('Error retrieving product within this category:', err);
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
// Fetch search products
function fetchProductsSearch (keyword, priceFilter, ratingFilter, callback) {
  let sqlStatement =
  'SELECT DISTINCT p.* FROM Product p ' +
  'LEFT JOIN Review r ON p.ProductID = r.ProductID ' +
  'WHERE p.Name LIKE ?' +
  (priceFilter ? ' AND p.Price >= ? AND p.Price <= ?' : '') +
  (ratingFilter ? ' AND r.Rating > ?' : '');
  let params = [`%${keyword}%`];
  if (priceFilter) {
    const priceRanges = getPriceRange(priceFilter);
    params.push(priceRanges.min, priceRanges.max);
  }

  if (ratingFilter) {
      params.push(getMinRating(ratingFilter));
  }  
  dbCon.query(sqlStatement, params, (err,results) => {
    if (err) {
      console.error('Error retrieving product using this keyword', err);
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
// Helper function to get price range based on predefined filters
function getPriceRange(priceFilter) {
  switch (priceFilter) {
      case '1-5':
          return { min: 1, max: 5 };
      case '5-10':
          return { min: 5, max: 10 };
      case '10-20':
          return { min: 10, max: 20 };
      case 'over20':
          return { min: 20, max: Number.MAX_SAFE_INTEGER };
      default:
          return null;
  }
}

// Helper function to get minimum rating based on predefined filters
function getMinRating(ratingFilter) {
  switch (ratingFilter) {
      case '>4':
          return 4;
      case '>3':
          return 3;
      case '>2':
          return 2;
      case '>1':
          return 1;
      default:
          return null;
  }
}
const webServer = http.createServer(applicationServer);
webServer.listen(port);
