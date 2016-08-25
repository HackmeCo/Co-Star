var express = require('express');
var bodyParser = require('body-parser');
var pmongo = require('promised-mongo');
var mongodb = require('mongodb');
var path = require('path');
//var -- = require('');

var app = express();
module.exports = app;

app.use( bodyParser.json() );      // Parse JSON request body
app.use( bodyParser.urlencoded({ extended: true }) );

// =================================
//           Endpoints
// =================================

app.get('/', function (req, res) {
  res.sendFile( path.join(__dirname, '../client', 'index.html') );
});

app.listen(3000, function(){
	console.log('Express app listening on port 3000 !!!!');
});