var mongoose = require( 'mongoose' );
var random = require('mongoose-simple-random'); 

var thespianSchema = new mongoose.Schema({
  // dropDups: true forces the creation of a unique index on the collection.  This will force
  // MongoDB to create a unique index by deleting documents with duplicate values
  id          : { type: Number, required: true, unique: true, dropDups: true }, 
  known_for   : Array,
  name        : { type: String, required: true },
  popularity  : Number,
  profile_path: String,
  adult       : Boolean
});
thespianSchema.plugin(random); //used in generating random thespian object

var Thespian = module.exports = mongoose.model('Thespian', thespianSchema);