var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article_schema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    filename: {
        type: String
    },
    media_count: {
        type: Number
    },
    media: {
        type: [{
            filename: {
                type: String
            }
        }]
    }
});

module.exports = mongoose.model('Article', article_schema);