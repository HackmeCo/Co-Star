var path = require('path');
var db = require('./db');
var app = require('./index.js');


// GET /thespians
/*
Server side get request that takes in the client side get request, 
takes a look at the path after /thespians. On the clientside, the path needs to follow the structure of
/thespians?name=first+last . With req.query.name, we'll focus on the content after the ? and
give back "first last" for the name. We then use that as the parameter for our 
database find function which will give back the full document(row) data on the actor.
Then it console logs that data.  
*/

app.get('/thespians', function (req, res) {
  return db.find(req.query.name)
  .then(function(actorData){
  	console.log('Here is the actor data from the database: ', actorData)
  })
})


// POST /thespians
/*
Server side post request that takes in the post request from the client side which should be taking in
an object of data on the actor and then adding it to the database. Then it console logs that data.
Object format being sent in via post request: 
{data: {
  "Id": Number, 
  "known_for": Array, 
  "Name": string, 
  "Popularity": number}
}
*/


app.post('/thespians', function (req, res) {
    db.addThespian(req.body.data)
    .then(function(data){
  	  console.log(data)
    })
  })

