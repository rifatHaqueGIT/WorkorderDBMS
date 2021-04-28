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

router.get("/makeprocessed", function(req, res){
		var sql = "SELECT Station_ID, W_name from WORKSTATION";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/makeprocessed", {stations: result});			
		}
	})
});

router.post("/makeprocessed", function(req, res){
	var sql = "INSERT INTO PROCESSED (Process_ID, Station_ID, End_Date) VALUES ?";
	var Process_ID = parseInt(req.body.processid);
	var Station_ID = parseInt(req.body.stationid);
	const End_Date = req.body.enddate;
	var values = 
	[[Process_ID, Station_ID, End_Date ]];
	console.log("Values", values);
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log(values);
			res.redirect("/");
		} else {
		console.log(result);	
			if(req.query.view){
				res.redirect("/viewOrders?view=true");
			} else {
				res.send({success: true})
			}
		}
	});
	
});

router.get("/removeProcessed", function(req, res){
	res.render("pages/removeProcessed");
});

router.delete("/removeProcessed", function(req, res){
	let sql ="DELETE FROM PROCESSED WHERE Process_ID = ? ";
	var Process_ID =parseInt(req.body.processid);
	connection.query(sql, Process_ID, function (err, result) {
		if (err) {
            console.log("DELETE Processed: " + err.message);          
            return res.redirect("/");
        }
		else {
			console.log("Number of records deleted: " + result.affectedRows);
			if(req.query.view){
				res.redirect("/viewOrders");
			} else {
				res.send({success: true});
			}
		}
	})	  
});

module.exports = router;