var mongoose = require( 'mongoose' );
var co = require('co');

var thespianSchema = new mongoose.Schema({
  id          : { type: Number, required: true, unique: true },
  known_for   : Array,
  name        : { type: String, required: true },
  popularity  : Number,
  profile_path: String,
  adult       : Boolean
});

var Thespian = module.exports = mongoose.model('Thespian', thespianSchema);