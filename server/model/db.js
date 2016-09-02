var mongoose = require( 'mongoose' );
mongoose.Promise = require('bluebird');  //fixes mongoose promise deprecation

var uri = require( '../uri' );

mongoose.connect(uri.uri);

//=====================================
//        Connection Events
//=====================================
// When successfully connected
mongoose.connection.on('connected', function  () {
  console.log('Mongoose default connection open to ' + uri.uri);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.error('Mongoose default connection error: ', err);
})

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

//=====================================
//    Bring in the Schemas & Models
//=====================================

require('./thespian');