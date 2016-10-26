// require mysql
var mysql = require('mysql');
// require prompt
var prompt = require('prompt');
// require inquirer
var inquirer = require('inquirer');

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
    console.log("connected as id " + connection.threadId);
})

// Running this application will first display all of the items available for sale.

// READ from the table
connection.query('SELECT * FROM Bamazon.Products', function(err, res) {
    if (err) throw err;
    console.log("=======================================================");
    console.log("This is Bamazon. See products available for sale");
    console.log("=======================================================");
    for (var i = 0; i < res.length; i++) {
        console.log("ID| " + res[i].id + " | Product: " + res[i].ProductName + " | Department: " + res[i].DepartmentName + " | Price: $" + res[i].Price + "|");
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
                message: "What is the id number of the product you wish to purchase?",
                validate: function(value) {
                    if (isNaN(value) == false && parseInt(value) > 0 && parseInt(value) <= 10) {
                        return true;
                    } else {
                        console.log("")
                        console.log("Please enter a number.")
                        return false;
                    }
                }
            }]).then(function(answer) {

                var idOfProductToBuy = answer.id - 1; //to be used as an index for the array
                // the second prompt asks the user about the quantity they need
                inquirer.prompt([{
                        name: "quantity",
                        type: "input",
                        message: "How many items would you like?",
                        validate: function(value) {
                            if (isNaN(value) == false && parseInt(value) > 0) {
                                return true;
                            } else {
                                console.log("")
                                console.log("Please enter a number.")
                                return false;
                            }
                        }
                    }]).then(function(ans) {
                        //var that caputres the quantity
                        var quantityToBuy = ans.quantity;
                        // print what user wants to do
                        console.log("You would like to buy " + quantityToBuy + " items of the product with id of " + answer.id + ".");
                        // select the column we need to use for updating the inventory
                        connection.query('SELECT StockQuantity FROM Bamazon.Products', function(err, res) {
                                if (err) throw err;
                                var startingInventory = res[idOfProductToBuy].StockQuantity;

                                if (quantityToBuy <= startingInventory) {

                                    console.log("You are in luck!");
                                    // print starting inventory 
                                    console.log("Starting inventory of the selected item is: " + res[idOfProductToBuy].StockQuantity)

                                    // quantity needed
                                    console.log("Customer buys " + quantityToBuy + " items.");
                                    // variable that caputures the difference after purchase
                                    var newQuantity = parseInt(res[idOfProductToBuy].StockQuantity - ans.quantity);
                                    // print new inventory
                                    console.log("Update ineventory: " + newQuantity + "." + " Progress seen in Bamazon Products table.");
                                    // update table in the back
                                    connection.query("UPDATE products SET ? WHERE ?", [{
                                        StockQuantity: newQuantity
                                    }, {
                                        id: answer.id
                                    }], function(err, res) {
                                        if (err) throw err;
                                    }); //close second query
                                } else {
                                    console.log("Insufficient quantity. We currently have " + startingInventory + " items.")
                                }

                            }) //close first query
                    }) //close second promise
            }) //close first promise
    } // close start();
