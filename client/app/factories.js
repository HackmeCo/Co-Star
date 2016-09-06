
angular.module('costars.factories', [])

.factory("ApiCalls", function($http){
  
  /*
  * Makes the search by person API call to TMDB. SBP calls return 
  * {"page": Number, "results": Array, "total_results": Number, "total_pages": Number}.
    In results: 
    "id": Number, "known_for": Array, "name": string, "popularity": number
        In known_for, 3 objects, each for a movie
          {"poster_path": URL (String), "overview": String, "release_date": String,
          "original_title": String, "id": Number, "popularity": Number(Float)}
      NB: Poster_path needs to be appended to https://image.tmdb.org/t/p/w396
  * Used when the list of current searches is size 1
  * Also sends the information to our database
  * @params actor: The name of the actor to search, as a string
  * @return the API call as a Promise, resolving with the actor's data
  * always searchByPerson for anyone new to gain the actor id so the discover call
  * can be made
  */
  
  var searchByPerson = function(actor){
    //NB: the API call doesn't care if there's extraneous whitespace in the actor name, but words MUST be separated by whitespace
    // console.log("Making SBP call for: ", actor);
    return $http({
      method: "GET",        //fetches the api token from the server, this is not ideal for security
      url: "/tmdb/token"    //and will need to be refactored for longterm deployment to internet
    })
    .then(function(resp){
      return $http({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/person?query='" + actor + "'&api_key=" + resp.data + "&sort_by=popularity.desc"
      });
    })
    .then(function(resp){
      // console.log("Success retrieving " + actor + "!\nGot back: ", resp);
      return resp.data;
    })
    .catch(function(err){
      console.error("Error: ", err);
      throw new Error(err);
    });
  };

  /*
  * Makes the discover API call for comparing several actors, returning a list of movies {"page" & "results"}
  * Results is an array that has a list of movies, formatted the same as they are in "known_for"
  * Used when the list of current searches has multiple actors
  * For the future, we can consider caching some results in our DB
  * @params actorIds: The IDs of all the actors to compare, as an array of numbers
  * @return the discover API call as a Promise, resolving with the list of movies
  */
  
  var discover = function(actorIds){
    var actorString = actorIds.join(','); //the list of actor Ids, now separated by commas in a string
    return $http({
      method: "GET",        //fetches the api token from the server, this is not ideal for security
      url: "/tmdb/token"    //and will need to be refactored for longterm deployment to internet
    })
    .then(function(resp){
      return $http({
        method: "GET",
        url: "https://api.themoviedb.org/3/discover/movie?api_key=" + resp.data + "&with_people=" + actorString + "&sort_by=popularity.desc"
      });
    })
    .then(function(resp){
      // console.log("Resp directly from discover call: ", resp);
      return resp.data.results;
    })
    .catch(function(err){
      //Do something with the error (display on the page?)
      console.error("Error: ", err);
      throw new Error(err);
    });
  };
  
  return {
    searchByPerson: searchByPerson,
    discover: discover
  };
}) //END OF API FACTORY

.factory('DB', function($http){

  /*
  * getActor makes a GET request to our database with an actor's name, searching for the actor's info
  * @param actorName the name of the actor we are searching for, as a String
  * @return A Promise that resolves with the actor's info, formatted similarly to the response given by TMDB
  * The Promise will reject if the actor is not found; we'll then make a call to TMDB (we'll get a 404)
  */

  var getActor = function(actorName){
    // console.log("Making DB call for: ", actorName);
    actorName = actorName.trim();
    var dataString = actorName.replace(/\s+/g, '+'); //replaces all whitespace blocks with '+'
    return $http({
      method: 'GET',
      url: '/thespians?name=' + dataString
    })
    .then(function(resp){
      // console.log('Response from DB.getActor (in DB.getActor): ', resp.data);
      return resp.data;
    })
    .catch(function(err){
      console.error("Error retrieving "+ actorName + ", " + err);
      throw new Error(err);
    });
  };

  /*
  * storeActor makes a POST request to our database to store an actor.
  * @param actorData, the actor's info as an object
  *   Object format: {"id": Number, "known_for": Array, "name": string, "popularity": number}
        In known_for, 3 objects, each for a movie
          {"poster_path": URL (String), "overview": String, "release_date": String,
          "original_title": String, "id": Number, "popularity": Number(Float)}
  * @return A Promise that will resolve if the post was successful, and will reject if not
  */

  var storeActor = function(actorData){
    //MUST CHECK IS DATA INPUT IS CORRECT!!!!!!! KH 

    var attrs = Object.assign({}, actorData);
    return $http({
      method:'POST',
      url:'/thespians',
      data: {data: attrs}
    })
    .then(function(resp){
      // console.log('store actor resp', resp);
      // console.log('store actor resp.data', resp.data);
      return resp.data;
    });
  };

  var randomActor = function(){
    return $http({
      method: 'GET',
      url:'/thespians/random'
    })
    .then(function(resp){
      // console.log("Got Random Actor: ", resp.data);
      return resp.data;
    });
  };

 return{
  getActor: getActor,
  storeActor: storeActor,
  randomActor: randomActor
 };

}) //END OF DB FACTORY

/*
* The factory for making DB requests concerning the leaderboard
*/

.factory('Leaderboard', function($http){

  /*
  * Gets all high scores stored in the DB
  * @return a promise which resolves with the scores
  */
  var getScores = function(){
    return $http({
      method: 'GET',
      url:'/leaderboard'
    })
    .then(function(resp){
      // console.log("Got from leaderboard.getScores: ", resp);
      return resp.data; //filters to only the scores
    })
    .catch(function(err){
      console.error("Error getting scores: ", err);
      throw new Error(err);
    });
  };

  /*
  * Posts to the leaderboard table
  * @param name: The player's inputted name, as a string
  * @param score: The player's score, as a number
  * @return a promise that resolves when the database finishes posting
  */

  var postScore = function(name, score){
    return $http({
      method: 'POST',
      url: '/leaderboard',
      data: {name: name, score: score}
    })
    .then(function(resp){
      // console.log("Success posting score");
    })
    .catch(function(err){
      console.error("Error posting score: ", err);
      throw new Error(err);
    });
  };

  return {
    getScores: getScores,
    postScore: postScore
  };
});