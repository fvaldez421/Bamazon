
var mysql = require("mysql");
var inquirer = require("inquirer");
var clc = require("cli-color");
var Table = require("cli-table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazonDB"
});

var username;
var manView = false;
var allProds = false;
var lowInv = false;
var noItem = false;


connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected as id " + connection.threadId + "\n");
	welcomeScreen();	
});

function valStr(str) {
	return str !== "" || "Entry must be in letters!";
};

function valNum(num) {
	var reg = /^\d+$/;
	return reg.test(num) || "Entry should be a number!";
};

function welcomeScreen() {
	console.log("Welcome to Bamazon! Please Log in to continue.");
	inquirer.prompt([
		{
			type: "input",
			message: "Username: ",
			name: "username",
			validate: valStr
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
				manView = true;
			}else {
				console.log("Welcome, " + username + "!")
				launchStore(username);
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
				showAll();
			}else {
				byDept();
			};
		});
};

function showAll() {
	console.log("");
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
	console.log("");
	connection.query("SELECT * FROM items", function(err, res) {
		if (err) throw err;

		inquirer.prompt([
			{
				type: "list",
				message: "Departments: ",
				choices: function() {
					var choiceArray = [];
					for (var i = 0; i < res.length; i++) {
						if (choiceArray.includes(res[i].department) === false) {
							choiceArray.push(res[i].department);
						};
					}
					return choiceArray;
				},
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
	});
};

function buy(res) {
	console.log("");
	inquirer.prompt([
		{
			type: "input",
			message: "Enter the desired product's ID number: ",
			name: "product",
			validate: valNum
		},
		{
			type: "input",
			message: "How many?",
			name: "quantity",
			validate: valNum
		}
		]).then(function(input) {
			if (input.product === "0" || input.quantity === "0") {
				noItem = true;
			}
			var total = (input.quantity * res[0].price);
			console.log("");
			if (!noItem) {
				inquirer.prompt([
					{
						type: "list",
						message: clc.red("Are you sure? ") +  "Items Total:" + clc.yellow.bold(" $" + total),
						choices: ["Yes", "No"],
						name: "confirm"
					}
					]).then(function(sure) {
						if (sure.confirm === "Yes") {

							confirmPur(input);
						}else {
							exit();
						};
					});
			}else {
				exit();
			};

			function confirmPur(input) {
					var query = connection.query(
						"SELECT * FROM items WHERE ?", {id: input.product}, function(err, res) {
						if (err) {
							console.log(err);
						}else {
							updateQuant(res, input, total);
						};
					});
					}
		});

	function updateQuant(res, input, total) {
		if (input.quantity > res[0].quantity) {
			console.log("");
			console.log(clc.red.bold("This item is out of stock :("));
			exit();
		}else {
			var newQuant = (res[0].quantity - parseInt(input.quantity));
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
	    			exit();
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

function exit(manView) {
	console.log("");
	inquirer.prompt([
		{
			type: "list",
			message: "Exit?",
			choices: ["Yes", "No"],
			name: "done"
		}
		]).then(function(input) {
			if (input.done === "Yes") {
				console.log(clc.green.bold("Thank you, come again!"));
				connection.end();
			}else {
				modeSelect();
			};
		});

};

function modeSelect() {
	if (manView) {
		console.log("");
		launchManager();
	}else {
		console.log("");
		launchStore();
	};
};

function launchManager(lowInv) {
	console.log("");
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			choices: ["View All Products", "View Low Inventory", "Add Inventory", "Add Product", "Exit"],
			name: "direction"
		}
		]).then(function(input) {
			switch(input.direction) {
				case "View All Products":
				manAll();
				break;

				case "View Low Inventory":
				manLow();
				break;

				case "Add Inventory":
				moreItem(lowInv);
				break;

				case "Add Product":
				addItem();
				break;

				case "Exit":
				manView = true;
				exit(manView);
				break;
			};
		});
};

function manAll() {
	console.log("");
	connection.query("SELECT * FROM items", function(err, res) {
		var table = new Table ({
			head: ["ID", "Item", "Price", "Dept", "Quant"],
			colWidths: [4, 20, 8, 20, 8]
		});

		if (err) {
			console.log(err);
		};
		for (var i = 0; i < res.length; i++) {
			table.push(
				[res[i].id, res[i].name, res[i].price, res[i].department, res[i].quantity]
			);
		};
		console.log(table.toString());
		moreItem();
	});
};

function manLow() {
	console.log("");
	connection.query("SELECT * FROM items", function(err, res) {
		var table = new Table ({
			head: ["ID", "Item", "Price", "Quant"],
			colWidths: [4, 20, 8, 8]
		});

		if (err) {
			console.log(err);
		};
		for (var i = 0; i < res.length; i++) {
			if (res[i].quantity < 5) {
				table.push(
					[res[i].id, res[i].name, res[i].price, res[i].quantity]
				);
			};
		};
		console.log(table.toString());
		moreItem();
	});
};

function moreItem(lowInv) {
	console.log("");
	inquirer.prompt([
		{
			type: "list",
			message: "Would you like to restock?",
			choices: ["Yes", "No"],
			name: "restock"
		}
		]).then(function(input) {
			if (input.restock === "Yes") {
				addParams();
			}else {
				launchManager();
			};
		});

	function addParams() {
		console.log("");
		inquirer.prompt([
			{
				type: "input",
				message: "Enter the product's ID number: ",
				name: "product",
				validate: valNum
			},
			{
				type: "input",
				message: "How many?",
				name: "quantity",
				validate: valNum
			}
			]).then(function(input) {
				var query = connection.query(
					"SELECT * FROM items WHERE ?", {id: input.product}, function(err, res) {
					if (err) {
						console.log(err);
					}else {
						updateQuant(res, input);
					};
				});

			});

		function updateQuant(res, input) {
			var newQuant = (res[0].quantity + parseInt(input.quantity));
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
					launchManager();
				}
			);
			if (input.quantity > 1) {
				console.log(clc.yellow.bold("\n" + input.quantity + " " + res[0].name + "s Added!" + "\n"));
			}else {
				console.log(clc.yellow.bold("\n" + input.quantity + " " + res[0].name + " Added!" + "\n"));
			};
		};
	};
};

function addItem() {
	console.log("");
	inquirer.prompt([
		{
			type: "input",
			message: "Enter item name: ",
			name: "name",
			validate: valStr
		},
		{
			type: "input",
			message: "Enter department: ",
			name: "department",
			validate: valStr
		},
		{
			type: "input",
			message: "Enter price: ",
			name: "price",
			validate: valNum
		},
		{
			type: "input",
			message: "Enter quantity:",
			name: "quantity",
			validate: valNum
		}
		]).then(function(input) {
			addNew(input);
		});
	function addNew(input) {
		var query = connection.query(
			"INSERT INTO items SET ?", {
				name: input.name,
				department: input.department.toLowerCase(),
				price: input.price,
				quantity: input.quantity
			},
			function(err) {
				if (err) throw err;
				launchManager();
			}
		);
		if (input.quantity > 1) {
			console.log(clc.yellow.bold("\n" + input.quantity + " " + input.name + "s Added!" + "\n"));
		}else {
			console.log(clc.yellow.bold("\n" + input.quantity + " " + input.name + " Added!" + "\n"));
		};
	};
};


