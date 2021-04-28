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

router.get("/removeCustomer", function(req, res){
	var sql = "SELECT Customer_ID, Cname from CUSTOMER";
	connection.query(sql, function(err, result){
		if(err){
			console.log("Error retrieving customers")
		} else {
			console.log(result);
			res.render("pages/removeCustomer", {customers: result});			
		}
	});
});

router.delete("/removeCustomer", function(req, res)
{
	let sql ="DELETE FROM CUSTOMER WHERE Customer_ID = ? ";
	const id = req.body.Customer_ID;
	connection.query(sql, id, function (err, result) {
		if (err) {
            console.log("DELETE Customer: " + err.message);          
            return res.redirect("/");
        }
		else {
			console.log(id);
			console.log("Number of records deleted: " + result.affectedRows);	
			if(req.query.view){
				res.redirect("/");
			} else {
				res.send({success: true});
			}
		}
	})	  
 });



module.exports = router;