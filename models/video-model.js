var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var video_schema = new Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    media: {
        type: [{
            filename: {
                type: String
            }
        }]
    }
});

module.exports = mongoose.model('Video', video_schema);