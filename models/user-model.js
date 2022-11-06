var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_schema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('User', user_schema);