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
// Include the ids, names, and prices of products for sale.

// READ
// create table
connection.query('SELECT * FROM Bamazon.Products', function(err, res) {
    if (err) throw err;
    console.log("=======================================================");
    console.log("This is Bamazon. These products are available for sale");
    console.log("=======================================================");
    for (var i = 0; i < res.length; i++) {
        console.log("______________________________________________________");
        console.log("|" + res[i].id + " | Product: " + res[i].ProductName + " | Department: " + res[i].DepartmentName + " | Price: $" + res[i].Price + "|");
        // console.log("______________________________________________________");
    }
    console.log("========================================================");
    start();
});

var start = function() {
        // The app then prompts users with **two messages**.
        // The first should ask them the ID of the product they would like to buy.
        // The second message should ask how many units of the product they would like to buy.
        console.log("Please enter the ID of the product you want and its quantity.")

        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the id number of the product you wish to purchase?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(answer) {

            var idOfProductToBuy = answer.id - 1;
            console.log(idOfProductToBuy);

            inquirer.prompt([{
                name: "quantity",
                type: "input",
                message: "How many items would you like?",
                validate: function(value) {
                    if (isNaN(value) == false && parseInt(value) > 0 && parseInt(value) <= 10) {
                        return true;
                    } else {
                        console.log("")
                        console.log("You can only buy 10 items at this point. Please, try again.")
                        return false;
                    }
                }
            }]).then(function(ans) {

                // console.log(ans.quantity);
                // console.log(idOfProductToBuy);

                var quantityToBuy = ans.quantity;
                console.log("You would like to buy " + quantityToBuy + " items of the product with id of " + answer.id);


                connection.query('SELECT StockQuantity FROM Bamazon.Products', function(err, res) {

                    if (err) throw err;
                    console.log(res)
                    console.log(res[idOfProductToBuy].StockQuantity)
                    console.log("Customer buys " + quantityToBuy);
                    var newQuantity = parseInt(res[idOfProductToBuy].StockQuantity - ans.quantity);
                    console.log("Update ineventory " + newQuantity);

                })
                connection.query("UPDATE products SET ? WHERE ?", [{
                    StockQuantity: newQuantity
                }, {
                    id: answer.id
                }], function(err, res) {
                    if (err) throw err;
                    console.log(res) });

            })
        })
    }
    // UPDATE Products
    // SET StockQuantity = newQuantity
    // WHERE id=1
