var express     = require("express");
var mysql       = require('mysql');
var app         = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var bodyParser  = require('body-parser');
var router = require("./routes");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// app.use('/', router);

var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'workorder'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.get("/", function(req, res){
	res.render("pages/frontpage");
});
app.get('/assignWorkWindow', function(req, res){
	res.render("pages/assignWorkWindow");
})

app.get('/orders', function(req, res){
	res.render("pages/orders");
})
app.get('/workstationWindow', function(req, res){
	res.render("pages/workstationWindow");
})

app.get('/processWindow', function(req, res){
	res.render("pages/processWindow");
});

app.use("/", require("./routes/customerorder"));
app.use("/", require("./routes/makecustomer"));
app.use("/", require("./routes/orderStatus"));
app.use("/", require("./routes/workstation"));
app.use("/", require("./routes/equipment"));
app.use("/", require("./routes/process"));
app.use("/", require("./routes/removeCustomer"));
app.use("/", require("./routes/assignments"));
app.use("/", require("./routes/status"));
app.use("/", require("./routes/processed"));

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});

exports.main = { connection };