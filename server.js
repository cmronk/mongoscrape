// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// PORT
var PORT = process.env.PORT || 3000;

// init express
var app = express();

// logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.get("/", function (req, res) {
    res.render("home");
});

// connect to DB
var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://localhost/mongoHeadlines");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// requiring routes
var routes = require("./controllers/scrapeController.js")(app);

// start server
app.listen(PORT, function () {
    console.log("MongoScaper is running on port " + PORT + "!");
});