// dependency
var mongoose = require("mongoose");

// Schema constructor
var Schema = mongoose.Schema;

// create new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        type: Boolean,
        default: false
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