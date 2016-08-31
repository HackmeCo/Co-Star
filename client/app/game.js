angular.module('costars.game', [])

.controller('GameController', function($scope, $location, ApiCalls, DB, Leaderboard){
  $scope.playing = false;
  $scope.loaded = false;
  $scope.lost = false;
  $scope.actors = [];
  $scope.choices = [];
  $scope.correctMovies = [];
  $scope.movies1 = [];
  $scope.movies2 = [];
  $scope.answer = "";
  $scope.score = 0;

  setInterval(function(){
   console.log("Answer: ", $scope.answer);
  }, 3000);

  /*
  * Makes database and API calls to update our actors and movie lists
  */
  $scope.updateGameState = function(){
    $scope.actors = [];
    $scope.choices = [];
    $scope.answer = "";

    return Promise.all([
      DB.randomActor()
      .then(function(actor1){ //get actor1
        // console.log("In updateGameState, actor1: ", actor1);
        $scope.actors.push(actor1)
      }),

      DB.randomActor()
      .then(function(actor2){ //get actor2
        // console.log("In updateGameState, actor2: ", actor2);
        $scope.actors.push(actor2)
      })
    ])
    .then(function(){
      return Promise.all([
        ApiCalls.discover($scope.actors.map(act => act.id)) //get the movies they're in together
        .then(function(films){
          $scope.correctMovies = films;
        }),

        ApiCalls.discover([$scope.actors[0].id, $scope.actors[0].id])
        .then(function(actor1films){
          $scope.movies1 = actor1films;
        }),

        ApiCalls.discover([$scope.actors[1].id, $scope.actors[1].id])
        .then(function(actor2films){
          $scope.movies2 = actor2films;
        })
      ])
    })
  }

  /*
  * Updates the game state, then creates a new question
  */

  $scope.create = function(){
    $scope.loaded = false;
    console.log("Creating a new question");
    return $scope.updateGameState()
    .then(function(){
        if($scope.actors[0].id === $scope.actors[1].id){
          return $scope.create(); //roll again, we got the same actor twice
        }
        $scope.movies1 = $scope.movies1.filter(movie => !$scope.correctMovies.map(cm=>cm.title).includes(movie.title));
        $scope.movies2 = $scope.movies2.filter(movie => !$scope.correctMovies.map(cm=>cm.title).includes(movie.title)); //filter out movies they've both been in
        if($scope.correctMovies.length){
          var correctChoice = getRand($scope.correctMovies);
          $scope.answer = correctChoice.title;
          $scope.choices.push(correctChoice);
        }
        else{
          if(Math.random() < .7){ //reroll 70% of the time -> Increases the number of good questions at the cost of load time
            return $scope.create();
          }else{
            $scope.answer = "";
          }
        }
        var numFrom1 = Math.floor(Math.random() * 4); //number of choices we take from the first actor
        // console.log("Taking " + numFrom1 + " from first actor");
        for(var i = 0; i < numFrom1 && $scope.movies1.length; i++){
          var movie = getRandIndex($scope.movies1);
          // console.log("Pushing to choices: ", $scope.movies1[movie]);
          if(!$scope.choices.includes($scope.movies1[movie])){
            $scope.choices.push($scope.movies1.splice(movie, 1)[0]);
          }
          else{
            i -= 1; //roll again
          }
        }
        while($scope.choices.length < 4 && $scope.movies2.length){
          var movie = getRandIndex($scope.movies2);
          if(!$scope.choices.includes($scope.movies2[movie])){
            $scope.choices.push($scope.movies2.splice(movie, 1)[0]);
          }
        }
        $scope.loaded = true;
        $scope.$apply(); //updates the page
      })
  }

  $scope.checkAnswer = function(movieTitle){
    console.log("The correct answer is: ", $scope.answer);
    if($scope.answer === movieTitle){
      $scope.score++;
      $scope.create();
    }
    else{
      $scope.answer = $scope.answer.length ? $scope.answer : "None of these!"; //checks if there was a correct answer
      $scope.lost = true;
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

  $scope.startGame = function(){
    $scope.playing = true;
    $scope.score = 0;
    $scope.lost = false;
    $scope.create();
  }

  $scope.submitChoice = function(movie){
    $scope.checkAnswer(movie.title);
  }

  $scope.submitScore = function(name){
    if(name && (name.length >= 2 && name.length <= 10)){
      Leaderboard.postScore(name, $scope.score)
      .then(function(){
        $location.path('/leaderboard');
      })
      .catch(function(err){
        console.log("Error submitting score: ", err);
        $location.path('/leaderboard');
      })
    } else{
      alert("Username must be between 2 and 10 characters");
    }
  }

}) //END OF GAME CONTROLLER
<<<<<<< 67fe05b38ef5f51b40e65851102947edf1b486bc

=======
<<<<<<< 9eec4eb1ac4493e022d2c44a080a19dac3051a43
=======


  
>>>>>>> Added a missing bracket
>>>>>>> Added a missing bracket
