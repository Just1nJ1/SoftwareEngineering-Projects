-- Active: 1698612447837@@127.0.0.1@3306
CREATE DATABASE shopease
    DEFAULT CHARACTER SET = 'utf8mb4';
use shopease

/* Create the Customer table */
CREATE TABLE IF NOT EXISTS Customer (
    `CustomerID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Membership_type` VARCHAR(50),
    `Renewal_date` DATE,
    `Address` VARCHAR(255),
    `Phone_number` VARCHAR(20),
    `Email` VARCHAR(255) UNIQUE,
    `Password` VARCHAR(255),
    `Username` VARCHAR(50) UNIQUE
);

/* Create the Category table */
CREATE TABLE IF NOT EXISTS Category (
    `CategoryID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Name` VARCHAR(25) NOT NULL UNIQUE,
    `Description` TEXT
);

/* Create the Supplier table */
CREATE TABLE IF NOT EXISTS Supplier (
    `SupplierID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Username` VARCHAR(50) UNIQUE,
    `Password` VARCHAR(255),
    `Email` VARCHAR(255) UNIQUE,
    `Phone_number` VARCHAR(20)
);

/* Create the Product table */
CREATE TABLE IF NOT EXISTS Product (
    `ProductID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Name` VARCHAR(100) NOT NULL UNIQUE,
    `Price` DECIMAL(10, 2) NOT NULL,
    `Description` TEXT,
    `CategoryID` INT,
    `SupplierID` INT,
    `StockInventory`  INT NOT NULL,
    `SalesNumber` INT,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);

/* Create the Review table */
CREATE TABLE IF NOT EXISTS Review (
    `ReviewID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Rating` DECIMAL(2, 1),
    `Content` TEXT,
    `CustomerID` INT,
    `ProductID` INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

/* Create the Cart table */
CREATE TABLE IF NOT EXISTS Cart (
    `CartID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `NUMBER` INT,
    `CustomerID` INT,
    `ProductID` INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

/* Create the Order table */
CREATE TABLE IF NOT EXISTS Purchase (
    `OrderID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `CustomerID` INT,
    `ProductID` INT,
    `PurchaseDate` DATE,
    `Quantity` INT,
    `TotalPrice` DECIMAL(10, 2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

INSERT INTO Category ( CategoryID, Name, Description )
                       VALUES
                       (1, 'Category1', 'This is Category1');
INSERT INTO Category ( CategoryID, Name, Description )
                       VALUES
                       (2, 'Category2', 'This is Category2');
INSERT INTO Category ( CategoryID, Name, Description )
                       VALUES
                       (3, 'Category3', 'This is Category3');

INSERT INTO Supplier ( SupplierID  )
                       VALUES
                       (1);
INSERT INTO Supplier ( SupplierID )
                       VALUES
                       (2);
INSERT INTO Supplier ( SupplierID )
                       VALUES
                       (3);

INSERT INTO Customer ( CustomerID  )
                       VALUES
                       (1);
INSERT INTO Customer ( CustomerID )
                       VALUES
                       (2);
INSERT INTO Customer ( CustomerID )
                       VALUES
                       (3);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (1, 'Black and Gray Athletic Cotton Socks - 6 Pairs', 10.90, 'This is a test', 100, 3, 1, 1);
INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (2, 'Intermediate Size Basketball', 20.95, 'This is a test2', 500, 4, 2, 2);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (3, 'test_test', 35.00, 'sdsadada', 50, 5, 3, 3);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (4, 'test_test2345465', 3533.00, 'sdsadada32342', 503, 6, 1, 3);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (5, 'test1234567', 167.00, 'hgsjkdguiwsgdujahbduiay', 761, 7, 2, 1);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (6, 'test12345678', 1678.00, '88888', 7618, 8, 3, 2);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (7, 'test123456789', 1678.00, '99999', 7618, 9, 3, 1);
INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber, CategoryID, SupplierID )
                       VALUES
                       (8, 'test123456789000', 1678.00, '000', 7618, 10, 2, 1);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (1, 4.5, 'GOOD!', 1, 1);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (2, 1.5, 'BAD!', 2, 2);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (3, 5, 'Great!', 3, 1);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (4, 3.0, 'ok', 2, 2);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (5, 4.5, 'GOOD!', 3, 3);

INSERT INTO Review ( ReviewID, Rating, Content , CustomerID, ProductID )
                       VALUES
                       (6, 4.5, 'GOOD!', 1, 3);
