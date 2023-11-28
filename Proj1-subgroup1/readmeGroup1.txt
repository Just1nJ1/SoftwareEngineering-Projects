This is subgroup1 working on User account requirement. We made 10 test cases in total. We used package mysql2, request, jasmine. Remember to download these package by npm to run the server.

Enter localhost:8080/api/login for login page
Enter localhost:8080/api/signup for register page
Enter localhost:8080/api/changepassword for change password page
Enter localhost:8080/api/dashboard for dashbordpage

Following is sql query to create database and table:

CREATE DATABASE shopeaDB;
USE shopeaDB;
CREATE TABLE accountinfo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(255)
);
USE shopeaDB;
INSERT INTO accountinfo (email, password, username, phone_number, address)
VALUES ('user1@example.com', 'PASSword123', 'user1', '1234567890', '123 Main St, City, Country');
INSERT INTO accountinfo (email, password, username, phone_number, address)
VALUES ('user2@example.com', 'pass456', 'user2', '9876543210', '456 Elm St, Town, Country');


There are image file inside folder show that test case is all passed.