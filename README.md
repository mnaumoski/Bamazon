# Bamazon


##Bamazon - Week of 12 HW: Node.js & MySQL

###Overview

####Video link to Challenge 1: https://youtu.be/LaeLlO37kbs

Creating an Amazon-like storefront with MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

Ideally, the app will track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.

Use the MySQL and Prompt npm packages.

###**Submission Guide**

###Challenge #1: Customer View (Minimum Requirement)

- Create a MySQL Database called Bamazon.

- Then create a Table inside of that database called Products.

- The products table should have each of the following columns:

        * ItemID (unique id for each product)

        * ProductName (Name of product)

        * DepartmentName

        * Price (cost to customer)

        * StockQuantity (how much of the product is available in stores)

*Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).*

Then create a Node application called **BamazonCustomer.js**. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

The app then prompts users with **two messages**.

* The first should ask them the ID of the product they would like to buy.
* The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like *Insufficient quantity!* , and then prevent the order from going through.
However, if the store does have enough of the product, the app should fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.