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
connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log("=======================================================");
  console.log("Products available for sale");
  console.log("=======================================================");
  for (var i = 0; i < res.length; i++) {
    console.log("______________________________________________________");
    console.log("|" +res[i].id + " | Product: " + res[i].ProductName+ " | Department: " + res[i].DepartmentName+ " | Price: $" +res[i].Price+ "|");
    console.log("______________________________________________________");
  }
  console.log("========================================================");
});