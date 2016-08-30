var express = require('express');
var bodyParser = require('body-parser');
var co = require('co');

var path = require('path');

var db = require('./model/db');
var helpers = require('./config/helpers');

var Thespian = require('./model/thespian');


var app = express();
module.exports = app;

app.use( bodyParser.json() );      // Parse JSON request body
app.use( bodyParser.urlencoded({ extended: true }) );


//        Static routes for serving up /client files
app.use(express.static(path.join(__dirname, '../client')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

//===============================================
//              thespians routes
//===============================================

app.get('/thespians', function (req, res) {
  var thespian = req.query.name;
  Thespian.find({ name : thespian }).exec(function(err, result) {
    if(err) {
      return helpers.errorHandler(err, req, res);
    } else {
      console.log('this is the returned item from Thespian.find: ', result);
      if (result.length > 1) {
        //if there is more than one thespian by the same name, this will send an array
        //with the object for each thespian
        res.send(result);
      } else if (result.length === 1) {
        //this is the normal operation, removes the single thespian from the array and
        //only returns the single object
        res.send(result[0]);
      } else {
        //returns 404 if array length is 0, nothing found in DB
        return helpers.notInDb(result, req, res);
      }
    }
  })

});

app.post('/thespians', function (req, res, next) {
  var thespianObj = req.body.data;
  console.log('The post to thespians getting triggered, here is the thespianObj: ', thespianObj);
  var NewThespian = new Thespian (thespianObj);
  NewThespian.save(function (err, post) {
    if (err) {
      console.error('Error in index.js line 58: ', err);
      return helpers.errorHandler(err, req, res);
    }
    console.log('NewThespian saved and it is a good day: ', post);
    res.send(post);
  })
});




//        Start the server on PORT or 3000
app.listen(process.env.PORT || 3000, function(){
	console.log(process.env.PORT ? 'Express app listening on port ' + process.env.PORT 
		                         : 'Express app listening on port 3000');

});