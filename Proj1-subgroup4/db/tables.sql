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

-- GROUP 4 ONLY

CREATE TABLE IF NOT EXISTS PaymentInfo (
    PaymentInfoID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    BillingAddress VARCHAR(255) NOT NULL,
    CardNumber VARCHAR(20) NOT NULL,
    ExpiryDate VARCHAR(5) NOT NULL,
    CVV VARCHAR(4) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID)
);

CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    PaymentInfoID INT NOT NULL,
    ProductIDs TEXT NOT NULL,
    NUMBERs TEXT NOT NULL,
    TotalPrice DECIMAL(10, 2), -- Added column for the actual total price
    FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID),
    FOREIGN KEY (PaymentInfoID) REFERENCES PaymentInfo(PaymentInfoID)
);

CREATE TABLE IF NOT EXISTS Coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    discount_percentage INT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    min_purchase_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS StateTaxes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL
);

INSERT INTO StateTaxes (state_code, tax_rate) VALUES
	('AL', 4.00),    # Alabama
    ('AK', 0.00),    # Alaska
    ('AZ', 5.60),    # Arizona
    ('AR', 6.50),    # Arkansas
    ('CA', 7.25),    # California
    ('CO', 2.90),    # Colorado
    ('CT', 6.35),    # Connecticut
    ('DE', 0.00),    # Delaware
    ('FL', 6.00),    # Florida
    ('GA', 4.00),    # Georgia
    ('HI', 4.00),    # Hawaii
    ('ID', 6.00),    # Idaho
    ('IL', 6.25),    # Illinois
    ('IN', 7.00),    # Indiana
    ('IA', 6.00),    # Iowa
    ('KS', 6.50),    # Kansas
    ('KY', 6.00),    # Kentucky
    ('LA', 4.45),    # Louisiana
    ('ME', 5.50),    # Maine
    ('MD', 6.00),    # Maryland
    ('MA', 6.25),    # Massachusetts
    ('MI', 6.00),    # Michigan
    ('MN', 6.875),   # Minnesota
    ('MS', 7.00),    # Mississippi
    ('MO', 4.225),   # Missouri
    ('MT', 0.00),    # Montana
    ('NE', 5.50),    # Nebraska
    ('NV', 6.85),    # Nevada
    ('NH', 0.00),    # New Hampshire
    ('NJ', 6.625),   # New Jersey
    ('NM', 5.125),   # New Mexico
    ('NY', 4.00),    # New York
    ('NC', 4.75),    # North Carolina
    ('ND', 5.00),    # North Dakota
    ('OH', 5.75),    # Ohio
    ('OK', 4.50),    # Oklahoma
    ('OR', 0.00),    # Oregon
    ('PA', 6.00),    # Pennsylvania
    ('RI', 7.00),    # Rhode Island
    ('SC', 6.00),    # South Carolina
    ('SD', 4.50),    # South Dakota
    ('TN', 7.00),    # Tennessee
    ('TX', 6.25),    # Texas
    ('UT', 6.10),    # Utah
    ('VT', 6.00),    # Vermont
    ('VA', 5.30),    # Virginia
    ('WA', 6.50),    # Washington
    ('WV', 6.00),    # West Virginia
    ('WI', 5.00),    # Wisconsin
    ('WY', 4.00)
;