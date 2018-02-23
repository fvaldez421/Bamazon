DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE items (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	department VARCHAR(30) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	quantity INT DEFAULT "0",
	PRIMARY KEY (id)
);

INSERT INTO items (name, department, price, quantity)
VALUES ("Tooth Brush", "hygene", 2, 36);

INSERT INTO items (name, department, price, quantity)
VALUES ("USB Phone Charger", "cell phone accessories", 8, 10);

INSERT INTO items (name, department, price, quantity)
VALUES ("Microwave", "appliances", 99.99, 12);

INSERT INTO items (name, department, price, quantity)
VALUES ("HD Flat Screen TV", "entertainment", 469.99, 10);

INSERT INTO items (name, department, price, quantity)
VALUES ("Backpack", "outdoor accessories", 45, 12);

INSERT INTO items (name, department, price, quantity)
VALUES ("Dental Floss", "hygene", 1.99, 52);

INSERT INTO items (name, department, price, quantity)
VALUES ("Tooth Paste", "hygene", 2.99, 20);

INSERT INTO items (name, department, price, quantity)
VALUES ("Deoderant", "hygene", 3.98, 26);

INSERT INTO items (name, department, price, quantity)
VALUES ("Toaster", "appliances", 35, 14);

INSERT INTO items (name, department, price, quantity)
VALUES ("Ear Phones", "cell phone accessories", 9.99, 26);
