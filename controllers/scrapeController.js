// dependencies
// requiring models
var db = require("../models");
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");

var express = require("express");
// requiring mongoose
var mongoose = require("mongoose");

// scraping tools
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

// init express
var app = express();

module.exports = function (app) {
    // routes
    // GET route for scraping news via axios 
    app.get("/scrape", function (req, res) {
        axios.get("https://www.popularmechanics.com/").then(function (response) {
            var $ = cheerio.load(response.data);

            $(".full-item").each(function (i, element) {
                var result = {};


                result.title = $(this).children(".full-item-content").find(".full-item-title").text();
                result.link = "https://www.popularmechanics.com/" + $(this).children("a").attr("href");
                result.summary = $(this).find(".full-item-dek p").text();
                var picture = $(this).children("a").find("img").attr("data-src").split("?");
                result.img = picture[0];
                // creates new Articles using result object
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
                console.log(result);
                console.log(result.length);
            });

            // goes home after scraping
            res.redirect("/");
        });
    });

    // route via request- works, commented out to use axios
    // app.get("/scrape", function (req, res) {
    //     request("https://www.popularmechanics.com/", function (error, response, html) {
    //         if (!error) {
    //             var $ = cheerio.load(response.data);

    //             $(".full-item").each(function (i, element) {
    //                 var result = {};


    //                 result.title = $(this).children(".full-item-content").find(".full-item-title").text();
    //                 result.link = "https://www.popularmechanics" + $(this).children("a").attr("href");
    //                 result.summary = $(this).find(".full-item-dek p").text();
    //                 var picture = $(this).children("a").find("img").attr("data-src").split("?");
    //                 result.img = picture[0];

    //                 // create new Article
    //                 db.Article.create(result)
    //                     .then(function (dbArticle) {
    //                         console.log(dbArticle);
    //                     })
    //                     .catch(function (err) {
    //                         return res.json(err);
    //                     })
    //                 console.log(result);
    //             });
    //         }
    //     });
    //     res.redirect("/");
    // });



    app.get('/savedArticles', function(req, res) {
        db.Article.find({saved: true})
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
        });
    });

    
    // route to get Articles from db
    app.get("/articles", function (req, res) {
        db.Article.find({ saved: false }).sort({ _id: -1 })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).sort({ _id: -1 })
            .then(function (dbArticles) {
                res.json(dbArticles);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    // route to grab specific Article by id and include note
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            // populate notes
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // route to update Article with note
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // routes to delete
    // route to update Article with note
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndRemove({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/articles/delete/:id", function (req, res) {
        db.Article.remove({ _id: req.params.id }).then(function (dbRemove) {
            res.json(dbRemove);
        });
    });

    app.post("/articles/save/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (dbRes) {
            res.redirect("/");
        })
    })
}