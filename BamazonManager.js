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
    start();
})

// Running this application will first display all of the items available for sale.

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
var start = function() {
        // First prompt asks user for ID of the product they would like to buy.
        console.log("Please select an option.")
        console.log("");
        inquirer.prompt([{
                name: "action",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                message: "Welcome Manager. Select an option from the folllowing menu."
            }]).then(function(answer) {
                switch (answer.action) {
                    case "View Products for Sale":
                        viewAll();
                        // decision();
                        break;
                    case "View Low Inventory":
                        viewLowInventory();
                        break;
                    case "Add to Inventory":
                        addToInventory();
                        // decision();
                        break;
                    case "Add New Product":
                        addNewProduct();
                        // decision();
                        break;
                }
                // decision();
            }) //close first promise
    } //close start function

// INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
// values("radio", "home" , 23, 20);
function addNewProduct() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "Type name of item for sale."
    }, {

        name: "dept",
        type: "input",
        message: "Enter depatment name."
    }, {
        name: "price",
        type: "input",
        message: "What is the price?",
        validate: function(value) {
            if (isNaN(value) == false && parseInt(value) > 0) {
                return true;
            } else {
                console.log("")
                console.log(error("ERROR: Please enter a number."))
                return false;
            }
        }
    }, {
        name: "qty",
        type: "input",
        message: "How many items are you adding to inventory?",
        validate: function(value) {
            if (isNaN(value) == false && parseInt(value) > 0) {
                return true;
            } else {
                console.log("")
                console.log(error("ERROR: Please enter a number."))
                return false;
            }
        }
    }]).then(function(answers) {

        console.log("")
        console.log("Added to inventory: " + answers.item + " | " + answers.dept + " | " + answers.price + " | " + answers.qty + " | ")
        console.log("")

        connection.query('INSERT INTO Bamazon.Products values (answers.item, answers.dept, answers.price, answers.qty)', function(err, adding) {

        }) 
      })
  }
// values("radio", "home" , 23, 20)

    //close prompt //close addNewProduct

function addToInventory() {


} //close addToInventory






function viewLowInventory() {

    connection.query('SELECT * FROM Bamazon.Products', function(err, response) {

        connection.query('SELECT StockQuantity FROM Bamazon.Products', function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].StockQuantity < 5) {
                        console.log(mag("|" + "Low Inventory of: " + res[i].StockQuantity + " | Item: " + response[i].ProductName));
                        decision();
                    } else {
                        console.log(y("All items have at least 5 items."))
                        decision();
                        return false;
                    }
                }

            }) //close low inv

    })
}


function viewAll() {

    // READ from the table
    connection.query('SELECT * FROM Bamazon.Products', function(err, res) {
        if (err) throw err;
        console.log("========================================================================");
        console.log(green("Welcome Manager. View products for sale."));
        console.log("========================================================================");
        for (var i = 0; i < res.length; i++) {
            console.log("ID| " + res[i].id + green(" | Product: ") + res[i].ProductName + " | Department: " + res[i].DepartmentName + " |" + mag(" Price: $") + mag(res[i].Price) + "| Inventory: " + res[i].StockQuantity + "|");
            console.log("--------------------------------------------------------------------");

        }
        console.log("========================================================================");
        console.log("Press any key to continue.");

    });

}

function decision() {
    console.log(green("========================================"))
    inquirer.prompt([{
        name: "decision",
        type: "confirm",
        message: "Would you like to start again?"
    }]).then(function(answer) {
        if (answer.decision == true) {
            start();
        } else {
            console.log("Exit.")
        }
    })
}
