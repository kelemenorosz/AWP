var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var expressfileupload = require('express-fileupload');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

//Change database name
mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser : true, useUnifiedTopology : true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, '/public/images')));
app.use(expressfileupload());
app.use(cors());

app.use('/', indexRouter);
app.use('/user', usersRouter);

module.exports = app;
