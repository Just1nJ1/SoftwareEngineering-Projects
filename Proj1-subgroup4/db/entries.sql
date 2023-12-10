-- Sample record

-- Insert sample customers
INSERT INTO Customer (Membership_type, Renewal_date, Address, Phone_number, Email, Password, Username)
VALUES ('Gold', '2024-01-01', '123 Example Street', '123-456-7890', 'customer1@example.com', 'password123', 'customer1');

-- Insert sample categories
INSERT INTO Category (Name, Description)
VALUES ('Electronics', 'Devices, gadgets, and technology-related items');

-- Insert sample suppliers
INSERT INTO Supplier (Username, Password, Email, Phone_number)
VALUES ('supplier1', 'password123', 'supplier1@example.com', '098-765-4321');

-- Insert sample products
INSERT INTO Product (Name, Price, Description, CategoryID, SupplierID, StockInventory, SalesNumber)
VALUES ('Smartphone', 299.99, 'Latest model with high specs.', 1, 1, 50, 0),
       ('Laptop', 999.99, 'High-performance laptop suitable for gaming and work.', 1, 1, 30, 0),
       ('iPhone', 999.99, 'Latest model with high specs.', 1, 1, 50, 0),
       ('ChromeBook', 1999.99, 'High-performance laptop suitable for gaming and work.', 1, 1, 30, 0);

-- Insert a sample cart item
INSERT INTO Cart (Number, CustomerID, ProductID)
VALUES (5, 1, 1),
       (5, 1, 3),
       (5, 1, 4);


INSERT INTO Coupons (code, discount_percentage, valid_from, valid_to, min_purchase_amount, max_discount_amount, is_active)
VALUES ('WINTER2023', 20, '2023-12-01', '2023-12-31', 100.00, 50.00, TRUE);



