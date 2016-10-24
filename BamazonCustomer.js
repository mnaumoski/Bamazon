// require mysql
var mysql = require('mysql');
// require prompt
var prompt = require('prompt');
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
connection.query('SELECT * FROM Products', function(err, res) {
    if (err) throw err;
    console.log("=======================================================");
    console.log("Products available for sale");
    console.log("=======================================================");
    for (var i = 0; i < res.length; i++) {
        console.log("______________________________________________________");
        console.log("|" + res[i].id + " | Product: " + res[i].ProductName + " | Department: " + res[i].DepartmentName + " | Price: $" + res[i].Price + "|");
        console.log("______________________________________________________");
    }
    console.log("========================================================");
    start();
});

var start = function() {
    prompt.start();
// The app then prompts users with **two messages**.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
console.log("Please enter the ID of the product you want and its quantity.")
  prompt.get([{
      message: "Enter a number",
      name: 'id',
      required: true,
      pattern: /[0-9]/
    }, {
      name: 'quantity',
      required: true,
      message: "Enter a number",
      pattern: /[0-9]/
    }], function (err, result) {
    // Log the results.
    console.log('Command-line input received:');
    console.log('Customer would like the product with id: ' + result.id);
    console.log('Customer desires quantity of ' + result.quantity);
  });
}


