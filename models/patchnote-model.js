var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patchnote_schema = new Schema({
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

module.exports = mongoose.model('Patchnote', patchnote_schema);