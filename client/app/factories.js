var token = window.token;
angular.module('costars.factories', [])

.factory("ApiCalls", function($http){
  
  /*
  * Makes the search by person API call to TMDB. SBP calls return 
  * {"page": Number, "results": Array, "total_results": Number, "total_pages": Number}.
    In results: 
    "Id": Number, "known_for": Array, "Name": string, "Popularity": number
        In known_for, 3 objects, each for a movie
          {"poster_path": URL (String), "overview": String, "release_date": String,
          "original_title": String, "id": Number, "popularity": Number(Float)}
      NB: Poster_path needs to be appended to https://image.tmdb.org/t/p/w396
  * Used when the list of current searches is size 1
  * Also sends the information to our database
  * @params actor: The name of the actor to search, as a string
  * @return the API call as a Promise, resolving with ???
  * always searchByPerson for anyone new to gain the actor id so the discover call
  * can be made
  */
  
  var searchByPerson = function(actor){
    //TODO: Consider checking the database here before doing the API call
    return $http({
      method: "GET",
      url: "https://api.themoviedb.org/3/search/person?query='" + actor + "'&api_key=" + token + "&sort_by=popularity.desc"
    })
    .then(function(resp){
      //send response to the database
      //display on the page
    })
    .catch(function(err){
      //Do something with the error (display on the page somewhere?)
      console.log("Error: ", err) //TODO: remove/comment this for release
    })
  }

  /*
  * Makes the discover API call for comparing several actors, returning a list of movies {"page" & "known_for"}
  * Used when the list of current searches has multiple actors
  * For the future, we can consider caching some results in our DB
  * @params actorIds: The IDs of all the actors to compare, as an array of numbers
  * @return the discover API call as a Promise, resolving with ???
  */
  
  var discover = function(actorIds){
    var actorString = actorIds.join(','); //the list of actor Ids, now separated by commas in a string
    return $http({
      method: "GET",
      url: "https://api.themoviedb.org/3/discover/movie?api_key=" + token + "&with_people=" + actorString + "&sort_by=vote_average.desc"
    })
    .then(function(resp){
      //display movies on the page
    })
    .catch(function(err){
      //Do something with the error (display on the page?)
      console.log("Error: ", err) //TODO: remove/comment this before release
    })
  }
  
  return {
    searchByPerson: searchByPerson,
    discover: discover
  }
}) //END OF API FACTORY

.factory('DB', function($http){

  /*
  * getActor makes a GET request to our database with an actor's name, searching for the actor's info
  * @param actorName the name of the actor we are searching for, as a String
  * @return A Promise that resolves with the actor's info, formatted similarly to the response given by TMDB
  * The Promise will reject if the actor is not found; we'll then make a call to TMDB (we'll get a 404)
  */

  var getActor = function(actorName){
    actorName = actorName.trim();
    var dataString = actorName.replace(/\s+/g, '+'); //replaces all whitespace blocks with '+'
    return $http({
      method: 'GET',
      url: '/thespians?name=' + dataString
    })
    .then(function(resp){
      console.log('resp', resp);
      console.log('resp.data', resp.data);
      return resp.data;
    })
  };


  }

  /*
  * storeActor makes a POST request to our database to store an actor.
  * @param actorData, the actor's info as an object
  *   Object format: {"Id": Number, "known_for": Array, "Name": string, "Popularity": number}
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
      url:'/thespians/',
      data: {data: attrs}
    })
    .then(function(resp){
      console.log('store actor resp', resp)
      console.log('store actor resp.data', resp.data)
      return resp.data;
    })
 }
 return{
  getActor: getActor,
  storeActor: storeActor
 };

}) //END OF DB FACTORY