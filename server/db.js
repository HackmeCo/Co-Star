var path = require('path');
var pmongo = require('promised-mongo');
var mongodb = require('mongodb');
var uri = require('./uri.js');
var db = pmongo(uri.uri, {authMechanism: 'ScramSHA1'});

module.exports = db;


    /*
    db.DeleteEverything will drop our thespians collection(think - whole table). Use this mostly for resets
    and testing.
    */

 	db.deleteEverything = function(){
 		return db.collection('thespians').remove({})
 		         .then(function(){
 		         	console.log('thespians table has been deleted');
 		         })
 	}
    
    /*
    db.addThespian takes the thespian object that is sent via post request and then inserts it into our 
    thespians table. This will be parsed out of the movieDB api get request data into a more consolidated 
    form of information that we will use. 
    */

 	db.addThespian = function(thespianObj){
        return db.collection('thespians').insert(thespianObj)
                 .then(function(data){
                 	console.log('addThespian(db.js): A thespian has entered our cast', thespianObj);
                 	return data;
                 })
 	}
    

    /*
    db.find will take the name of an actor and then do a search through our database looking for the name
    of that actor and provide back the full actor's object with all of the information on that actor 
    that has been stored
    */

 	db.find = function(actor){
 		return db.collection('thespians').find({name: actor})
 		         .then(function(actorRow){
 		         	return actorRow;
 		         })

 	}