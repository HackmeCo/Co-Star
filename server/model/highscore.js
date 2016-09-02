var mongoose = require( 'mongoose' ); 
var uuid = require('node-uuid');

/*
leaderboardSchema is a database collection(table) that stores the scores of people
playing the game. When requested, it will give back the top 10 high scores along with the names 
that were entered in. Post and get requests will be on index.js
*/


var leaderboardSchema = new mongoose.Schema({
  

  id          : { type: String, default: uuid }, 
  name        : { type: String, minlength: 3, maxlength: 10, required: true },
  score       : { type: Number, required: true}
});


var Highscore = module.exports = mongoose.model('Highscore', leaderboardSchema);