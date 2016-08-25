var token = require('../../token.js');

.factory("ApiCalls", function($http){
  
  /*
  * Makes the search by person API call to TMDB. SBP calls return {???}
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
      url: "https://api.themoviedb.org/3/search/person?query=" + actor + "&api_key=" + token + "&sort_by=popularity.desc"
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
  * Makes the discover API call for comparing several actors, returning a list of movies
  * Used when the list of current searches has multiple actors
  * For the future, we can consider caching some results in our DB
  * @params actorIds: The IDs of all the actors to compare, as an array of numbers
  * @return the discover API call as a Promise, resolving with ???
  */
  
  var discover = function(actorIds){
    //TODO: convert actorIds into a string for the URL
    return $http({
      method: "GET",
      url: "https://api.themoviedb.org/3/discover/movie?api_key=" + token + "&with_people=" + actorId + actorId + "&sort_by=vote_average.desc"
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
})