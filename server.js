// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");
// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// requiring models
var db = require("./models");

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// routes
// GET route for scraping news 
app.get("/scrape", function(req, res) {
    axios.get("https://gizmodo.com/tag/science-fiction").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h1").each(function(i, element) {
            var result = {};

            result.title = $(this)
              .children("a")
              .text();
            //   add summary and picture

            result.link = $(this)
              .children("a")
              .attr("href");
            
            // creates new Articles using result object
            db.Article.create(result)
              .then(function(dbArticle) {
                  console.log(dbArticle);
              })
              .catch(function(err){
                  return res.json(err);
              });
        });

        res.send("Scrape complete.");
    });
});

// route to get Articles from db
app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      });
});

// route to grab specific Article by id and include note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    // populate notes
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// route to update Article with note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      });
});

// start server
app.listen(PORT, function() {
    console.log("MongoScaper is running on port " + PORT + "!");
});