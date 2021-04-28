var express = require("express");
var router  = express.Router();
var mysql   = require('mysql');
var bodyParser  = require('body-parser');

var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'workorder'
});

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/makecustomer", function(req, res){
	res.render("pages/makeCustomer");
});

router.post("/makecustomer", function(req, res){
	var sql = "INSERT INTO CUSTOMER (Customer_ID, Cname, Address, Phone_Number) VALUES ?";
	var Customer_ID = req.body.customerid;
	var Cname = req.body.cname;
	var Phone_Number = req.body.phonenumber;
	var Address = req.body.address;
	var values = [
	[Customer_ID, Cname, Address, Phone_Number]];
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log("Error", err);
			res.redirect("/");
		} else {
		//then, redirect to the index
		if(req.query.view){
		res.redirect("/");
		} else {
			res.send({succes: true});
		}
		}
	});
	
});
	
module.exports = router;