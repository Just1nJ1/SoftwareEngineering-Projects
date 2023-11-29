-- Active: 1698612447837@@127.0.0.1@3306
CREATE DATABASE shopease
    DEFAULT CHARACTER SET = 'utf8mb4';
use shopease

/* Create the Category table */
CREATE TABLE IF NOT EXISTS Category (
    `CategoryID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Name` VARCHAR(25) NOT NULL UNIQUE,
    `Description` TEXT
);


/* Create the Product table */
CREATE TABLE IF NOT EXISTS Product (
    `ProductID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Name` VARCHAR(100) NOT NULL UNIQUE,
    `Price` DECIMAL(10, 2) NOT NULL,
    `Description` TEXT,
    `StockInventory`  INT NOT NULL,
    `SalesNumber` INT
);

/* Create the Review table */
CREATE TABLE IF NOT EXISTS Review (
    `ReviewID` INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    `Rating` DECIMAL(2, 1),
    `Content` TEXT,
    `ProductID` INT,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (1, 'Black and Gray Athletic Cotton Socks - 6 Pairs', 10.90, 'This is a test', 100, 3);
INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (2, 'Intermediate Size Basketball', 20.95, 'This is a test2', 500, 4);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (3, 'test_test', 35.00, 'sdsadada', 50, 5);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (4, 'test_test2345465', 3533.00, 'sdsadada32342', 503, 6);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (5, 'test1234567', 167.00, 'hgsjkdguiwsgdujahbduiay', 761, 7);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (6, 'test12345678', 1678.00, '88888', 7618, 8);

INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (7, 'test123456789', 1678.00, '99999', 7618, 9);
INSERT INTO Product ( ProductID, Name, Price , Description, StockInventory, SalesNumber )
                       VALUES
                       (8, 'test123456789000', 1678.00, '000', 7618, 10);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (1, 4.5, 'GOOD!', 1);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (2, 1.5, 'BAD!', 2);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (3, 5, 'Great!', 1);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (4, 3.0, 'ok', 2);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (5, 4.5, 'GOOD!', 3);

INSERT INTO Review ( ReviewID, Rating, Content , ProductID )
                       VALUES
                       (6, 4.5, 'GOOD!', 3);
