// dependency
var mongoose = require("mongoose");

// Schema constructor
var Schema = mongoose.Schema;

// create new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// utilizing mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// exporting so we can use it
module.exports = Article;