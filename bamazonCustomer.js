
var mysql = require("mysql");
var inquirer = require("inquirer");
var clc = require("cli-color");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "CMMAnum_1",
  database: "bamazonDB"
});

var username;
var manager = false;
var customer = false;


connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected as id " + connection.threadId + "\n");
	welcomeScreen();	
});

function welcomeScreen() {
	console.log("Welcome to Bamazon! Please Log in to continue.")
	inquirer.prompt([
		{
			type: "input",
			message: "Username: ",
			name: "username"
		},
		{
			type: "input",
			message: "Password: ",
			name: "password"
		},
		{
			type: "list",
			message: "Type of Login: ",
			choices: ["Customer", "Manager"],
			name: "loginType"
		}
		]).then(function(input) {
			username = input.username
			if (input.loginType === "Manager") {
				console.log("Welcome Manager, " + username + "!");
				launchManager(username);
				manager = true;
			}else {
				console.log("Welcome, " + username + "!")
				launchStore(username);
				customer = true;
			};
		});
};

function launchStore(username) {
	inquirer.prompt([
		{
			type: "list",
			message: "How would you like to shop?",
			choices: ["All", "By Department"],
			name: "shopStyle"
		}
		]).then(function(input) {
			if (input.shopStyle === "All") {
				console.log("");
				shopAll();
			}else {
				console.log("");
				byDept();
			};
		});
};

function launchManager(username) {

};
function shopAll() {
	console.log("All items listed here...");
	connection.query("SELECT * FROM items", function(err, res) {
		if (err) {
			console.log(err);
		};
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id + " " + res[i].name + ": $" + res[i].price + "\n");
		};
		buy(res);
	});
};

function byDept() {
	inquirer.prompt([
		{
			type: "list",
			message: "Departments: ",
			choices: ["appliances", "cell phone accessories", "entertainment", "hygene", "outdoor accessories"],
			name: "deptSelect"
		}
		]).then(function(input) {
			console.log(clc.green.bold("\nSelected Department: " + input.deptSelect + "\n"));

			var query = connection.query(
				"SELECT * FROM items WHERE ?", {department: input.deptSelect}, function(err, res) {
				if (err) {
					console.log(err);
				}else {
					for (var i = 0; i < res.length; i++) {
						console.log(res[i].id + " " + res[i].name + ": $" + res[i].price + "\n");
					};
				};
				buy(res);
			});
		});
};

function buy(res) {
	inquirer.prompt([
		{
			type: "input",
			message: "Enter the number of the desired product: ",
			name: "product"
		},
		{
			type: "input",
			message: "How many?",
			name: "quantity"
		}
		]).then(function(input) {
			var query = connection.query(
				"SELECT * FROM items WHERE ?", {id: input.product}, function(err, res) {
				if (err) {
					console.log(err);
				}else {
					updateQuant(res, input);
				}
			});
		});

	function updateQuant(res, input) {
		if (input.quantity > res[0].quantity) {
			console.log(clc.red.bold("This item is out of stock :("));
			finished();
		}else {
			var newQuant = (res[0].quantity - 1);
			var total = (input.quantity * res[0].price);
			var query = connection.query(
				"UPDATE items SET ? WHERE ?", 
				[
				{
					quantity: newQuant
				},
				{
					id: res[0].id
				}
				],
				function(err, res) {
					// console.log("Quantity updated!");
	    			finished();
				}
			);
			if (input.quantity > 1) {
			console.log(clc.yellow.bold("\n" + input.quantity + " " + res[0].name + "s Purchased! \nInvoice total: $" + total + "\n"));
			}else {
			console.log(clc.yellow.bold("\n" + input.quantity + " " + res[0].name + " Purchased! \nInvoice total: $" + total + "\n"));
			};
		};
	};
};
function finished() {
	inquirer.prompt([
		{
			type: "list",
			message: "Continue Shopping?",
			choices: ["Yes", "No"],
			name: "done"
		}
		]).then(function(input) {
			if (input.done === "No") {
				console.log(clc.red.bold("Thank you, come again!"));
				connection.end();
			}else {
				if (customer === true) {
					console.log("");
					launchStore(username);
				}else {
					console.log("");
					launchManager(username);
				}
			}
		})
}
