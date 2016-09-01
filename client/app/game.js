angular.module('costars.game', [])

.controller('GameController', function(Game, $scope, $location, ApiCalls, DB){
  $scope.actors = Game.actors;
  $scope.score = Game.score;
  $scope.movieChoices = Game.choices;
  $scope.playing = false;
  $scope.create = Game.create;

  setInterval(function(){
   // console.log("Current Scope: ");
   // console.log("Scope.actors: ", $scope.actors);
    console.log("Scope.movieChoices ", $scope.movieChoices);
 //   console.log("Game.actors: ", Game.actors);
  }, 3000);

  $scope.startGame = function(){
    $scope.playing = true;
    $scope.create();
  }

  $scope.submitChoice = function(movie){
    Game.checkAnswer(movie.title);
  };
})

.factory('Game', function(ApiCalls, DB){
  console.log("DB: ", DB);

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
    //actors = [];
    //movies = [];

    return Promise.all([
      DB.randomActor()
      .then(function(actor1){ //get actor1
        console.log("In updateGameState, actor1: ", actor1);
        actors.push(actor1)
      }),

      DB.randomActor()
      .then(function(actor2){ //get actor2
        console.log("In updateGameState, actor2: ", actor2);
        actors.push(actor2)
      })
    ])
    .then(function(){
      return Promise.all([
        ApiCalls.discover(actors.map(act => act.id)) //get the movies they're in together
        .then(function(films){
          correctMovies = films;
        }),

        ApiCalls.discover([actors[0].id, actors[0].id])
        .then(function(actor1films){
          movies1 = actor1films;
        }),

        ApiCalls.discover([actors[1].id, actors[1].id])
        .then(function(actor2films){
          movies2 = actor2films;
        })
      ])
    })
  }  

  /*
  * Updates the game state, then creates a new question
  */

  var create = function(){
    return updateGameState()
    .then(function(){
        console.log("Finished updating game state");
        console.log("Actors: ", actors);
        console.log("Movies (both): ", correctMovies);
        console.log("Movies for " + actors[0] + ":", movies1);
        console.log("Movies for " + actors[1] + ":", movies2);
        movies1 = movies1.filter(movie => !correctMovies.includes(movie));
        movies2 = movies2.filter(movie => !correctMovies.includes(movie)); //filter out movies they've both been in
        if(correctMovies.length){
          var correctChoice = getRand(correctMovies);
          answer = correctChoice.title;
          choices.push(correctChoice);
        }
        else{
          answer = "";
        }
        var numFrom1 = Math.floor(Math.random() * 4); //number of choices we take from the first actor
        console.log("Taking " + numFrom1 + " from first actor");
        for(var i = 0; i < numFrom1 && movies1.length; i++){
          var movie = getRandIndex(movies1);
          console.log("Pushing to choices: ", movies1[movie]);
          if(!choices.includes(movies1[movie])){
            choices.push(movies1.splice(movie, 1)[0]);
          }
          else{
            i -= 1; //roll again
          }
        }
        while(choices.length < 4 && movies2.length){
          var movie = getRandIndex(movies2);
          if(!choices.includes(movies2[movie])){
            choices.push(movies2.splice(movie, 1)[0]);
          }
        }
      })
  }

  var checkAnswer = function(movieTitle){
    if(answer === movieTitle){
      score++;
      create();
    }
    else{
      score = 0;
      alert("You lose! The correct answer was: ", answer !== "" ? answer : "None of these!");
      create();
    }
  }

  /*
  * Gets a random item out of an array
  */
  var getRand = function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }

  var getRandIndex = function(arr){
    return Math.floor(Math.random() * arr.length);
  }

  return {
    actors: actors,
    score: score,
    checkAnswer: checkAnswer,
    choices: choices,
    create: create
  }
  
})