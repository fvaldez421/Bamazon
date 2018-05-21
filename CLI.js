var inquirer = require("inquirer");
var clc = require("cli-color");
var connection = require("./appFiles/DB");

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
			}else {
				console.log("Welcome, " + username + "!")
				launchStore(username);
			};
		});
};

