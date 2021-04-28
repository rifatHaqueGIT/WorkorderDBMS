var express = require("express");
var router  = express.Router();
var mysql   = require('mysql');
var bodyParser  = require('body-parser');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));


var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'workorder'
});

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/makeorder", function(req, res){
	var sql = "SELECT Customer_ID, Cname from CUSTOMER";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/makeorder", {customers: result});			
		}
	})
});

router.post("/makeorder", function(req, res){
	var sql = "INSERT INTO ord (Customer_ID, Descrip, Start_Date, End_Date) VALUES ?";
	var Customer_ID = req.body.customerid;
	var Description = req.body.description;
	var date = new Date().toISOString().slice(0, 10);//todays date b/c thats the start date
	var Required_date = req.body.requireddate;
	var values = [
	[Customer_ID, Description, date , Required_date]];
	console.log("Make order!")
	connection.query(sql, [values], function (err, result) {
		if(err){
			res.redirect("/");
		} else {
		//then, redirect to the index
		if(req.query.view){
			res.redirect("orders");
		} else {
			res.send({success: true})
		}
		}
	});
	
});

	
module.exports = router;