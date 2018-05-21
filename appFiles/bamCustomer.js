var connection = require("./DB");
var inquirer = require("inquirer");
var clc = require("cli-color");

module.exports = function() {
	var lowInv = false;
	var noItem = false;

	launchStore();
	function valNum(num) {
		var reg = /^\d+$/;
		return reg.test(num) || "Entry should be a number!";
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
}
