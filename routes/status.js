var express = require("express");
var router  = express.Router();
var mysql   = require('mysql');
var bodyParser  = require('body-parser');
const random = require('random')
const methodOverride = require('method-override');
router.use(methodOverride('_method'));


var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'workorder'
});

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/addstatus", function(req, res){
	res.render("pages/status");
});

router.post("/addstatus", function(req, res){
	var sql = "INSERT INTO STATUS (Station_ID, Completion_Date, Order_No) VALUES ?";
	var Station_ID = req.body.station_id;
	var Completion_Date = req.body.completion_date;
	var Order_No = req.body.order_no;
	var values = [
	[Station_ID, Completion_Date, Order_No ]];
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log(err);
			res.redirect("/");
		} else {
		//then, redirect to the index
		if(req.query.view){
			res.redirect("/orders");
		} else {
			res.send({success: true});
		}
		}
	});
	
});

router.get("/removeStatus", function(req, res){
	res.render("pages/removestatus");
});

router.delete("/removeStatus", function(req, res){
	let sql ="DELETE FROM STATUS WHERE Order_No = ? ";
	var Order_No =parseInt(req.body.order_no);
	connection.query(sql, Order_No, function (err, result) {
		if (err) {
            console.log("DELETE Status: " + err.message);          
            return res.redirect("/");
        }
		else {
			console.log("Number of records deleted: " + result.affectedRows);
			if(req.query.view){
				res.redirect("/orders");
			} else {
				res.send({success: true});
			}
		}
	})	  
});

router.get("/changeStatus", function(req, res){
	res.render("pages/updatestatus");
});

router.put("/changeStatus", function(req, res){
	var sql = "UPDATE STATUS SET Station_ID = ?, Completion_Date = ? WHERE Order_No = ?";
	const station_id = req.body.station_id;
	const Completion_Date = req.body.completion_date;
	const Order_No = req.body.order_no;
	connection.query(sql, [station_id, Completion_Date, Order_No], function(err, result) {
		if(err){
			console.log("Error", err);
		} else {
			console.log(result);
			if(req.query.view){
				res.redirect("/orders");
			} else {
				res.send({success: true});
			}
		}
	})
});

module.exports = router;