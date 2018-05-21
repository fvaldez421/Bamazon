var connection = require("./DB");
var inquirer = require("inquirer");
var clc = require("cli-color");
var Table = require("cli-table");

module.exports = function(){    
    launchManager();
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

}