/*jshint esversion: 6 */
angular.module('costars.game', [])

.controller('GameController', function($scope, $location, ApiCalls, DB, Leaderboard, $interval){
  $scope.playing = false; //used to show/hide elements associated with gameplay
  $scope.loaded = false; //If true, hides the game and shows the loading screen
  $scope.lost = false; //If true, losing screen is shown
  $scope.leaderboardPos = null; //The position on the leaderboard the player scored, if any (0-indexed)
  $scope.actors = []; //The list of actors to display
  $scope.choices = []; //Movie options
  var correctMovies = []; //All movies found that both actors have starred in
  var movies1 = []; //Movies for the first actor
  var movies2 = []; //Movies for the 2nd actor
  var answer = ""; //Correct answer
  $scope.score = 0; //
  $scope.time = 10;
  $scope.dispAnswer = ""; //answer to display on loss
  var timer;

  /*
  * Makes database and API calls to update our actors and movie lists
  * @return A Promise that resolves when 3 discover calls have completed
  */
  $scope.updateGameState = function(){
    $scope.actors = [];
    $scope.choices = [];
    answer = "";

    return Promise.all([
      DB.randomActor()
      .then(function(actor1){ //get actor1
        // console.log("In updateGameState, actor1: ", actor1);
        $scope.actors.push(actor1);
      }),

      DB.randomActor()
      .then(function(actor2){ //get actor2
        // console.log("In updateGameState, actor2: ", actor2);
        $scope.actors.push(actor2);
      })
    ])
    .then(function(){
      return Promise.all([
        ApiCalls.discover($scope.actors.map(act => act.id)) //get the movies they're in together
        .then(function(films){
          correctMovies = films;
        }),

        ApiCalls.discover([$scope.actors[0].id, $scope.actors[0].id])
        .then(function(actor1films){
          movies1 = actor1films;
        }),

        ApiCalls.discover([$scope.actors[1].id, $scope.actors[1].id])
        .then(function(actor2films){
          movies2 = actor2films;
        })
      ]);
    });
  };

  /*
  * Updates the game state, then creates a new question
  */

  $scope.create = function(){
    $scope.loaded = false;
    // console.log("Creating a new question");
    return $scope.updateGameState()
    .then(function(){
        if($scope.actors[0].id === $scope.actors[1].id){
          return $scope.create(); //roll again, we got the same actor twice
        }
        movies1 = movies1.filter(movie => !correctMovies.map(cm=>cm.title).includes(movie.title));
        movies2 = movies2.filter(movie => !correctMovies.map(cm=>cm.title).includes(movie.title)); //filter out movies they've both been in
        if(correctMovies.length){
          var correctChoice = getRand(correctMovies);
          answer = correctChoice.title;
          $scope.choices.push(correctChoice);
        }
        else{
          if(Math.random() < 0.85){ //reroll 85% of the time -> Increases the number of good questions at the cost of load time
            return $scope.create();
          }else{
            answer = "";
          }
        }
        var numFrom1 = Math.floor(Math.random() * 4); //number of choices we take from the first actor
        // console.log("Taking " + numFrom1 + " from first actor");
        for(var i = 0; i < numFrom1 && movies1.length; i++){
          var movieFrom1 = getRandIndex(movies1);
          // console.log("Pushing to choices: ", movies1[movie]);
          if(!$scope.choices.includes(movies1[movieFrom1])){
            $scope.choices.push(movies1.splice(movieFrom1, 1)[0]);
          }
          else{
            i -= 1; //roll again
          }
        }
        while($scope.choices.length < 4 && movies2.length){
          var movieFrom2 = getRandIndex(movies2);
          if(!$scope.choices.includes(movies2[movieFrom2])){
            $scope.choices.push(movies2.splice(movieFrom2, 1)[0]);
          }
        }
        $scope.loaded = true;
        startTimer();
        $scope.$apply(); //updates the page
      });
  };


  /*
  * Gets a random item out of an array
  */
  var getRand = function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var getRandIndex = function(arr){
    return Math.floor(Math.random() * arr.length);
  };

  /*
  * Starts a new game and creates the first question
  */

  $scope.startGame = function(){
    $scope.playing = true;
    $scope.score = 0;
    $scope.lost = false;
    $scope.leaderboardPos = null;
    $scope.create();
  };

  /*
  * Submits an answer; called when a choice is clicked
  */

  $scope.submitChoice = function(movie){
    stopTimer();
    checkAnswer(movie.title);
  };

  /*
  * Checks the submitted answer against the correct answer
  * Triggers a loss if the answer is wrong, increments score and makes a new question otherwise
  */

  var checkAnswer = function(movieTitle){
    // console.log("The correct answer is: ", answer);
    if(answer === movieTitle){
      $scope.score++;
      $scope.create();
    }
    else{
      lose();
    }
  };

  /*
  * Submits the player's score and username to the leaderboard
  */

  $scope.submitScore = function(name){
    if(name && (name.length >= 2 && name.length <= 10)){
      Leaderboard.postScore(name, $scope.score)
      .then(function(){
        $location.path('/leaderboard');
      })
      .catch(function(err){
        console.error("Error submitting score: ", err);
        $location.path('/leaderboard');
      });
    } else{
      alert("Username must be between 2 and 10 characters");
    }
  };

  /*
  * Pathing to other pages
  */

  $scope.goHome = function(){
   $location.path("/");
  };

  $scope.goToLeaderboard = function(){
    $location.path("/leaderboard");
  };

  /*
  * For starting and stopping the game timer
  */

   var startTimer = function(){
    stopTimer();
    $scope.time = 10; //reset to 10 seconds
    timer = $interval(function(){
      $scope.time -= 1;
      if($scope.time <= 0){
        lose();
      }
    }, 1000);
   };

   var stopTimer = function(){
    if(timer){
      $interval.cancel(timer);
    }
   };

   /*
   * Triggers a loss when called, hiding the game and displaying the losing screen
   * Checks if the player has scored high enough to place on the leaderboard
   */
   var lose = function(){
    $scope.loaded = false;
    $scope.dispAnswer = answer.length ? answer : "None of these!"; //checks if there was a correct answer
    Leaderboard.getScores()
    .then(function(highscores){
      $scope.lost = true;
      stopTimer();
      if($scope.score > highscores[0].score){
        $scope.leaderboardPos = 0;
      } else if($scope.score > highscores[highscores.length - 1].score){
        for(var i = highscores.length - 2; i >= 0; i--){
          if(highscores[i].score >= $scope.score){
            $scope.leaderboardPos = i+1;
            break;
          }
        }
      }
      $scope.loaded = true;
    })
    .catch(function(err){
      console.error("Scores failed to load: ", err);
      $scope.lost = true;
      stopTimer();
      $scope.loaded = true;
    });
   };

}); //END OF GAME CONTROLLER
