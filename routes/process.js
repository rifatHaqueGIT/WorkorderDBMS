var express = require("express");
var router  = express.Router();
var mysql   = require('mysql');
var bodyParser  = require('body-parser');
const random = require('random')
const methodOverride = require('method-override');
const utilities = require('../utilities');
router.use(methodOverride('_method'));


var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'workorder'
});

router.use(bodyParser.urlencoded({ extended: false }));

//Displau creat process page
router.get("/createProcess", function(req, res){
	//Get list of orders
	const sql1 = "SELECT ord_number from ord";
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
		let result = { orders: values[0], workStations: values[1]};
		console.log("Result", result);
		res.render("pages/process", result);
	});
});

router.get("/updateProcess", function(req, res){
		//Get list of orders
	const sql1 = "SELECT Process_ID from PROCESS";
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
		let result = { processes: values[0], workStations: values[1]};
		console.log("Result", result);
		res.render("pages/updateProcess", result);
	});
});

router.get("/removeProcess", function(req, res){
	var sql = "SELECT Process_ID from PROCESS";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/removeProcess", {processes: result});			
		}
	})
});

router.delete("/removeProcess", function(req, res){
	let sql ="DELETE FROM PROCESS WHERE Process_ID = ? ";
	const id = parseInt(req.body.p_ID);
	connection.query(sql, id, function (err, result) {
		if (err) {
            console.log("DELETE Process: " + err.message);          
            return res.redirect("/processWindow");
        }
		else {
			console.log(id);
			console.log("Number of records deleted: " + result.affectedRows);
			utilities.formatResponse(req, res, { result: result }, 'pages/processWindow');
		}
	})	  
});
router.post("/createProcess", function(req, res){
	var sql1 = "INSERT INTO PROCESS (Process_ID, Station_ID, Start_Date) VALUES ?";
	var sql2 = "INSERT INTO PROGRESS_UPDATE (Process_ID, Order_No) VALUES ?"
	const process_id = random.int(1, 1000000000);
	const station_id = parseInt(req.body.Station_ID);
	const start_date = req.body.Start_Date;
	const order_no = parseInt(req.body.Order_No);
	const vals1 = [[process_id, station_id, start_date]];
	const vals2 = [[process_id, order_no]];
	console.log("Vals", vals1, vals2);
	connection.query(sql1, [vals1], function(err, result) {
		if(err){
			console.log("Error", err);
			res.send(err);
		} else {
			connection.query(sql2, [vals2], function(err, result){
				if(err){
				   console.log("Error", err);
					res.send(err);
				   } else {
						if(req.query.view){
							res.render("pages/processWindow")
						} else {
							req.send({success: true})
						}
				   }
			})
			console.log(result);
		}
	})
});

router.put("/updateProcess", function(req, res){
	var sql = "UPDATE PROCESS SET Station_ID = ?, Start_Date = ? WHERE Process_ID = ?";
	const station_id = req.body.Station_ID;
	const start_date = req.body.Start_Date;
	const process_id = req.body.Process_ID;
	connection.query(sql, [station_id, start_date, process_id], function(err, result) {
		if(err){
			console.log("Error", err);
		} else {
			console.log(result);
			if(req.query.view){
				res.render("pages/processWindow");
			} else {
				res.send({success: true})
			}
		}
	})
});

router.get("/viewProcesses", function(req, res){
		var sql="SELECT p.Process_ID, o.ord_number, o.Descrip, p.Start_Date FROM PROCESS as p JOIN PROGRESS_UPDATE as pu JOIN ord as o JOIN CUSTOMER as c WHERE p.Process_ID=pu.Process_ID AND o.ord_number = Order_No AND o.Customer_ID = c.Customer_ID"
	connection.query(sql, function(err, result) {
		if(err){
			console.log("Error", err);
		} else {
			if(req.query.view){
				res.render('pages/viewProcesses', { processes: result });
			} else {
				res.send({ processes: result });
			}
		}
	})
})
	
module.exports = router;