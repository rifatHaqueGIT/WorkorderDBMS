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

router.get("/equipment", function(req, res){
	var sql = "SELECT Station_ID, W_name from WORKSTATION";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/equipment", {workStations: result});			
		}
	});
});

router.get("/removeEquipment", function(req, res){
	var sql = "SELECT Serial_No, E_Name from EQUIPMENT";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/removeEquipment", {equipment: result});			
		}
	});
});

router.post("/equipment", function(req, res){
	var sql = "INSERT INTO EQUIPMENT (Serial_No, Station_No, E_Name) VALUES ?";
	var Serial_No = parseInt(req.body.serial_no);
	var Station_No = parseInt(req.body.station_no);
	var E_Name = req.body.e_name;
	var values = [
	[Serial_No, Station_No, E_Name]];
	console.log(values);
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log("Cannot insert Equipment: " + err.message); 
			res.redirect("/");
		} else {
		console.log(result);
		if(req.query.view){
			res.redirect("/workStationWindow");
		} else {
			res.send({success: true});
		}
		}
	});
	
});
router.delete("/removeEquipment", function(req, res)
{
	let sql ="DELETE FROM EQUIPMENT WHERE Serial_No = ? ";
	const id = req.body.Serial_No;
	connection.query(sql, id, function (err, result) {
		if (err) {
            console.log("DELETE Customer: " + err.message);          
            return res.redirect("/");
        }
		else {
			console.log(id);
			console.log("Number of records deleted: " + result.affectedRows);
			if(req.query.view){
				res.redirect("/workStationWindow");
			} else {
				res.send({success: true});
			}
		}
	})	  
 });

router.get("/allEquipment", function(req, res){
		var sql="SELECT e.Serial_No,e.e_Name, w.W_name, m.Mname FROM EQUIPMENT as e JOIN WORKSTATION as w JOIN MANAGER as m  WHERE e.Station_No = w.Station_ID AND w.M_ID = m.ID_NO"
		
	connection.query(sql, function(err, result) {
		if(err){
			console.log("Error", err);
		} else {
			console.log(result);
			if(req.query.view){
				res.render("pages/allEquipment", { equipment: result });
			} else {
				res.send({equipment: result});
			}
		}
	})
})
	
module.exports = router;