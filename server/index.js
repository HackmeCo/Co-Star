var express = require('express');
var bodyParser = require('body-parser');
var pmongo = require('promised-mongo');
var mongodb = require('mongodb');
var path = require('path');
//var -- = require('');

var app = express();


app.get('/', function(req, res){
	res.send('Hello World!');
});



app.listen(3000, function(){
	console.log('Express app listening on port 3000 !!!!');
});