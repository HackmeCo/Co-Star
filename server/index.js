var express = require('express');
var bodyParser = require('body-parser');
var random = require('mongoose-simple-random');

var path = require('path');

var db = require('./model/db');
var helpers = require('./config/helpers');

var Thespian = require('./model/thespian');
var Highscore = require('./model/highscore');


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

    /*
    get to /thespians will take the name of an actor (this name comes in as a query, ex: /thespains?name=Tom+Hanks)
    and then do a search through our database looking for the name of that actor and provide back the full actor's
    object with all of the information on that actor that has been stored
    */

app.get('/thespians', function (req, res) {
  var thespian = req.query.name;
  Thespian.find({ name : thespian }).exec(function(err, result) {
    if(err) {
      return helpers.errorHandler(err, req, res);
    } else {
      //console.log('this is the returned item from Thespian.find: ', result);
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

    /*
    get to /thespians/random will return a random document from the Thespian DB,
    returns the same thespian object as the single response from get /thespians
    */

app.get('/thespians/random', function(req, res) {
  console.log('random get has been triggered here.');
  // findOneRandom is a funciton from npm mongoose-simple-random
  Thespian.findOneRandom(function(err, results) {
    if(err) {
      console.error('error in findOneRandom: ', err);
      return helpers.errorHandler(err, req, res);
    } else {
      console.log('success findOneRandom');
      res.send(results);
    }
  })
});

    /*
    post to /thespians takes the thespian object that is sent and then inserts it into our 
    thespians table. This will be parsed out of the movieDB api get request data into a more consolidated 
    form of information that we will use. 
    */

app.post('/thespians', function (req, res) {
  var thespianObj = req.body.data;
  console.log('The post to thespians getting triggered');
  var NewThespian = new Thespian (thespianObj);
  NewThespian.save(function (err, post) {
    if (err) {
      console.error('Error in index.js line 70: ', err);
      return helpers.errorHandler(err, req, res);
    }
    console.log('NewThespian has entered our DB');
    res.send(post);
  })
});

//===============================================
//              Leaderboard routes
//===============================================

/*
get request to LeaderboardSchema that takes a look at the database, and takes out the top ten documents in order 
of score (decending order) and sends them back as an array of objects (if there is anything in the database). 
Example: [{id: 3jrh4iur98sfn, name: Axe, score: 8}, {id: lk3jor8fokijdf98, name: Sam, score: 6}, 
{id: k3lrkjso8du8, name: Jess, score: 3}]
*/

app.get('/leaderboard', function (req, res) {
 Highscore.find( {score: {$exists: true}} ).sort({score: -1}).limit(10)
 .exec(function(err, result) {
    if(err) {
      return helpers.errorHandler(err, req, res);
    } else {
      //console.log('this is the returned item from Highscore.find...: ', result);
      if (result.length > 0) {
        //If there is content in the database, then send the top 10 results via array of objects.
        res.send(result);
      } else {
        //returns 404 if array length is 0, nothing found in the leaderboards database.
        return helpers.noHighScoresYet(result, req, res);
      }
    }
  })
})

/*
post request to the /leaderboard that deposits a document containing a name and a score into
the LeaderboardSchema database. It should generate a uuid for the id key.
Example: {name: James, score: 4}
*/

app.post('/leaderboard', function (req, res) {
  var highScoreObj = req.body;
  console.log('The post to Leaderboard getting triggered');
  var NewHighScore = new Highscore (highScoreObj);
  NewHighScore.save(function (err, post) {
    if (err) {
      console.error('This highscore could not be posted to the database: ', err);
      return helpers.errorHandler(err, req, res);
    }
    console.log('A new highscore has entered our DB');
    res.send(post);
  })
});


//        Start the server on PORT or 3000
app.listen(process.env.PORT || 3000, function(){
	console.log(process.env.PORT ? 'Express app listening on port ' + process.env.PORT 
		                         : 'Express app listening on port 3000');

});