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

router.get("/assign", function(req, res){
	//Get list of managers
	const sql1 = "SELECT ID_NO, Mname from MANAGER";
	let q1 = new Promise((resolve, reject) => {
		connection.query(sql1, function(err, result) {
			if(err){
				console.log(err);
			} else {
				resolve(result);
			}
		})
	});
	//Get list of employees
	const sql2 = "SELECT ID_NO, Name from EMPLOYEE";
		let q2 = new Promise((resolve, reject) => {
		connection.query(sql2, function(err, result) {
			if(err){
				console.log(err);
			} else {
				resolve(result);
			}
		})
	});
	//Get list of Workstations
	const sql3 = "SELECT Station_ID, W_name from WORKSTATION";
		let q3 = new Promise((resolve, reject) => {
		connection.query(sql3, function(err, result) {
			if(err){
				console.log(err);
			} else {
				resolve(result);
			}
		})
	});
	//Resolve promises and render site when all complete
	Promise.all([q1, q2, q3]).then(values => {
		let result = { managers: values[0], employees: values[1], workStations: values[2]};
		console.log("Result", result);
		res.render("pages/assign", result);
	});
 });
router.get("/unassign", function(req, res){
		//Get list of employees
	const sql1 = "SELECT ID_NO, Name from EMPLOYEE";
		let q1 = new Promise((resolve, reject) => {
		connection.query(sql1, function(err, result) {
			if(err){
				console.log(err);
			} else {
				resolve(result);
			}
		})
	});
	//Get list of Workstations
	const sql2 = "SELECT Station_ID, W_name from WORKSTATION";
		let q2 = new Promise((resolve, reject) => {
		connection.query(sql2, function(err, result) {
			if(err){
				console.log(err);
			} else {
				resolve(result);
			}
		})
	});
	//Resolve promises and render site when all complete
	Promise.all([q1, q2]).then(values => {
		let result = { employees: values[0], workStations: values[1]};
		console.log("RESULT", result)
		res.render("pages/unassign", result);
	});
 });

router.post("/assign", function(req, res){
	var sql = "INSERT INTO ASSIGNS (M_ID, E_ID, Station_ID) VALUES ?";
	var m_ID = parseInt(req.body.manager_id);
	var e_ID = parseInt(req.body.employee_id);
	var s_ID = parseInt(req.body.station_id);
	console.log("ASSIGN");
	console.log(req.body);
	var values = [
	[m_ID, e_ID, s_ID]];
	connection.query(sql, [values], function (err, result) {
		if(err){
			console.log("Error", err);
			res.redirect("/");
		} else {
		//then, redirect to the index
		if(req.query.view){
			console.log("Query " + req.query);
			res.redirect("/assignWorkWindow");
		} else{
			console.log("No query");
			res.send({ success: true })
		}
		}
	});
 });

router.delete("/unassign", function(req, res){
	let sql ="DELETE FROM ASSIGNS WHERE (E_ID = ?) AND (Station_ID = ?)";
	const e_id = req.body.e_ID;
	const s_id = parseInt(req.body.s_ID);
	var values = 
	[e_id, s_id];
	connection.query(sql, values, function (err, result) {
		if (err) {
            console.log("DELETE Customer: " + err.message);          
            return res.redirect("/");
        }
		else {
			console.log("Number of records deleted: " + result.affectedRows);
			if(req.query.view){
				res.redirect("/assignWorkWindow");
			} else {
				res.send({success: true});
			}
		}
	})	  
 });

module.exports = router;