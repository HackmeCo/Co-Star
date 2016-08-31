angular.module('costars.game' , [])

.controller('GameController', function(Game, $scope, $location){
  $scope.actors = Game.actors;
  $scope.score = Game.score;
  $scope.movieChoices = Game.movies;

  $scope.submitChoice = function(movie){

  };
})

.factory('Game', function(ApiCalls, DB){

  var actors = [];
  var choices = [];
  var correctMovies = [];
  var movies1 = [];
  var movies2 = [];
  var answer = "";
  var score = 0;

  
  /*
  * Makes database and API calls to update our actors and movie lists
  */
  var updateGameState = function(){
    actors = [];
    movies = [];

    return DB.randomActor().then(function(actor1){ //get actor1
      actors.push(actor1);
      DB.randomActor().then(function(actor2){ //get actor2
        actors.push(actor2);
        return Promise.all([
          ApiCalls.discover(actors.map(act => act.id)) //get the movies they're in together
          .then(function(films){
            correctMovies = films;
          }),

          ApiCalls.discover([actor1.id, actor1.id])
          .then(function(actor1films){
            movies1 = actor1films;
          }),

          ApiCalls.discover([actor2.id, actor2.id])
          .then(function(actor2films){
            movies2 = actor2films;
          })
        ])
      })
    })
  }

  /*
  * Updates the game state, then creates a new question
  */

  var create = function(){
    return updateGameState()
    .then(function(){
      choices.push(getRand(correctMovies));
      movies1 = movies1.filter(movie => !correctMovies.includes(movie));
      movies2 = movies2.filter(movie => !correctMovies.includes(movie)); //filter out movies they've both been in
      var numFrom1 = Math.floor(Math.random() * 4);
      var numFrom2 = 3 - numFrom1; //number from each actor we're going to take
      for(var i = 0; i < numFrom1; i++){
        choices.push(getRand(movies1));
      }
      for(var j = 0; j < numFrom2; j++){
        choices.push(getRand(movies2));
      }
    })
  }

  /*
  * Gets a random item out of an array
  */
  var getRand = function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }
})