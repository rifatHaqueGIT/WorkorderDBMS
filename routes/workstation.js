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

router.get("/workstation", function(req, res){
	var sql = "SELECT ID_NO, Mname from MANAGER";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/workstation", {managers: result});			
		}
	});
});

router.post("/workstation", function(req, res){
	var sql = "INSERT INTO WORKSTATION (Station_ID, W_name, M_ID) VALUES ?";
	var Station_ID = parseInt(req.body.station_id);
	var W_name = req.body.workstation_name;
	var M_ID = parseInt(req.body.manager_id);
	var values = [
	[Station_ID, W_name, M_ID]];
	console.log(values);
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log(err);
			res.redirect("/");
		} else {
		//then, redirect to the index
		if(req.query.view){
			res.redirect("workstationWindow");
		} else {
			res.send({success: true});
		}
		}
	});
	
});
	
module.exports = router;