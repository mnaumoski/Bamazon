// require mysql
var mysql = require('mysql');
// require prompt
var prompt = require('prompt');
// require inquirer
var inquirer = require('inquirer');
var chalk = require('chalk');

var error = chalk.bold.red;
var green = chalk.bold.green;
var mag = chalk.bold.magenta;
var y = chalk.bold.yellow;



// define connection to already created database Bamazon in MySQL Workbench
var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root", //Your username
        password: "", //Your password
        database: "Bamazon"
    })
    //when connection is established print the connectionThredID
connection.connect(function(err) {
    if (err) throw err;
    console.log(mag("connected as id " + connection.threadId));
})

// Running this application will first display all of the items available for sale.

// READ from the table
connection.query('SELECT * FROM Bamazon.Products', function(err, res) {
    if (err) throw err;
    console.log("=======================================================");
    console.log(green("This is Bamazon. See products available for sale"));
    console.log("=======================================================");
    for (var i = 0; i < res.length; i++) {
        console.log("ID| " + res[i].id + green(" | Product: ") + res[i].ProductName + " | Department: " + res[i].DepartmentName + " |" + mag(" Price: $") + mag(res[i].Price) + "|");
        console.log("------------------------------------------------------");

    }
    console.log("========================================================");
    console.log("");
    // invoke start funciton
    start();
});

var start = function() {
        // First prompt asks user for ID of the product they would like to buy.
        console.log("Please enter the ID of the product you want and its quantity.")
        console.log("");
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Enter id number of the product you wish to purchase?",
            validate: function(value) {
                if (isNaN(value) == false && parseInt(value) > 0 && parseInt(value) <= 10) {
                    return true;
                } else {
                    console.log("")
                    console.log(error("ERROR: Please enter a number smaller than 10."))
                    return false;
                }
            }
        }]).then(function(answer) {

                var idOfProductToBuy = answer.id - 1; //to be used as an index for the array
                // the second prompt asks the user about the quantity they need
                test();

                function test() {
                    inquirer.prompt([{
                            name: "quantity",
                            type: "input",
                            message: "How many items would you like?",
                            validate: function(value) {
                                if (isNaN(value) == false && parseInt(value) > 0) {
                                    return true;
                                } else {
                                    console.log("")
                                    console.log(error("ERROR: Please enter a number."))
                                    return false;
                                }
                            }
                        }]).then(function(ans) {
                            //var that caputres the quantity
                            var quantityToBuy = ans.quantity;
                            // print what user wants to do
                            console.log(y("You would like to buy " + quantityToBuy + " items of the product with id of " + answer.id + "."));
                            // select the column we need to use for updating the inventory
                            connection.query('SELECT StockQuantity FROM Bamazon.Products', function(err, res) {
                                    if (err) throw err;
                                    var startingInventory = res[idOfProductToBuy].StockQuantity;

                                    if (quantityToBuy <= startingInventory) {

                                        console.log(green("You are in luck!"));
                                        console.log("")
                                        // print starting inventory 
                                        console.log("Starting inventory of the selected item is: " + res[idOfProductToBuy].StockQuantity)
                                        console.log("")
                                        // quantity needed
                                        console.log(mag("Success! You just bought " + quantityToBuy + " items. You will get your order email confirmation promptly. Sit tight and enjoy."));
                                        // variable that caputures the difference after purchase
                                        var newQuantity = parseInt(res[idOfProductToBuy].StockQuantity - ans.quantity);
                                        // print new inventory
                                        console.log("")
                                        console.log(green("Update ineventory: " + newQuantity + "." + " Progress seen in Bamazon Products table."));
                                        // update table in the back
                                        connection.query("UPDATE products SET ? WHERE ?", [{
                                            StockQuantity: newQuantity
                                        }, {
                                            id: answer.id
                                        }], function(err, res) {
                                            if (err) throw err;
                                        }); //close second query
                                    } else {
                                            console.log(error("ERROR: Insufficient quantity. We currently have " + startingInventory + " items."));

                                            inquirer.prompt([{
                                                    name: "cont",
                                                    type: "confirm",
                                                    message: "Would you like to change your order?"
                                            }]).then(function(confirm) {
                                                    if (confirm.cont === true) {
                                                        test();
                                                    } else {
                                                        console.log(y("Ok then. Sorry about that. Come and see us soon."));
                                                        prompt.stop()
                                                    }
                                                })
                                }

                                }) //close first query
                        }) //close second promise
                }
            })
        } //close first promise
         // close start();
