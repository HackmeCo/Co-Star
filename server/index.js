var express = require('express');
var bodyParser = require('body-parser');
var pmongo = require('promised-mongo');
var mongodb = require('mongodb');
var path = require('path');
var db = require('./db');

var app = express();
module.exports = app;

app.use( bodyParser.json() );      // Parse JSON request body
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(express.static(path.join(__dirname, '../client')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

app.listen(process.env.PORT || 3000, function(){
	console.log(process.env.PORT ? 'Express app listening on port ' + process.env.PORT 
		                         : 'Express app listening on port 3000');

});