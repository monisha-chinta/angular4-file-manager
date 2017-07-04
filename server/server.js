var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Grid = require('gridfs-stream');
var busboyBodyParser = require('busboy-body-parser');
var bodyParser = require('body-parser');

const port = process.env.PORT || '3001';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(busboyBodyParser({limit: '5mb'}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({secret: 'angular2'}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, '../dist')));

require('./passport')(passport);
require('./mongoose.js')();
require('./routes.js')(app, passport);

app.listen(port, function() {
  console.log("Listening on " + port);
});
