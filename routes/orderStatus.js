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




router.get("/viewOrders", function(req, res){
	var sql="SELECT ord_number, ord.Customer_ID, Descrip, Start_Date, End_Date, Cname FROM ord JOIN CUSTOMER WHERE ord.Customer_ID=CUSTOMER.Customer_ID"
	connection.query(sql, function(err, result) {
		if(err){
			console.log("Error", err);
		} else {
			if(req.query.view){
			res.render("pages/viewOrders", { orders: result });
			} else {
				res.send({ orders: result });
			}
		}
	})
});

router.get("/viewOrderStatus", async function(req, res){
	var sql = "SELECT ord_number, Customer_ID, Descrip, Start_Date, End_Date FROM ord WHERE ord_number= ?";
	var sql1 = "SELECT * from PROCESS as p join PROGRESS_UPDATE as pu join ord as o where p.Process_ID = pu. Process_ID AND ord_number = Order_No AND ord_number=?"
	var sql2 = " SELECT * from PROCESS as p join PROGRESS_UPDATE as pu join ord as o JOIN PROCESSED as r where p.Process_ID = pu. Process_ID AND ord_number = Order_No AND ord_number=19 AND p.Process_ID = r.Process_ID AND ord_number = ?";
	const ord_number = req.query.ord_number;
	//NEED TO GET PROCESSES COMPLETED AND TO BE COMPLETED FOR WORK ORDER
	//Promise so that multiple calls can be made and nothing is executed until all resolved
	let order = new Promise((resolve, reject) => {
		connection.query(sql, [ord_number], function (err, result) {
			if(err){
				res.redirect("/");
				console.log("Error", err);
				console.log("Request query", req.query);
				reject();
			} else {
				console.log("Result", result[0]);
				resolve(result[0]);
			}
		});
	});
	
	let processes = new Promise((resolve, reject) => {
			connection.query(sql1, [ord_number], function (err, result) {
			if(err){
				res.redirect("/");
				console.log("Error", err);
				console.log("Request query", req.query);
				reject();
			} else {
				console.log("Result", result);
				resolve(result);
			}
		});
	})
	
	let processed = new Promise((resolve, reject) => {
				connection.query(sql2, [ord_number], function (err, result) {
			if(err){
				res.redirect("/");
				console.log("Error", err);
				console.log("Request query", req.query);
				reject();
			} else {
				console.log("Result", result);
				resolve(result);
			}
		});
	})
	
	//When all promises have resolved render page
	Promise.all([order, processes, processed]).then(values => {
		console.log(values);
		let result = { order: values[0], processes: values[1], processed: values[2] };
		if(req.query.view){
			res.render("pages/orderstatus", result);
		} else {
			res.send(result);
		}
	});
});


module.exports = router;