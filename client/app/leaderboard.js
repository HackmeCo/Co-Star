angular.module('costars.leaderboard', [])

.controller('LeaderboardController', function($scope, Leaderboard, $location){
  /*
  * Functions for redirecting to other pages
  */

  $scope.goToGame = function(){
    $location.path("/game");
  };
  $scope.goToHome = function(){
    $location.path("/");
  };
  
  $scope.scores = []; //The scores, as objects {name: String, score: Number}
  $scope.loaded = false; //Set to true when the leaderboard has loaded
  $scope.error = false; //Displays an error message if the scores fail to load

  Leaderboard.getScores() //fetch high scores
  .then(function(data){
    $scope.error = false;
    $scope.scores = data;
    $scope.loaded = true;
  })
  .catch(function(err){
    console.error("Scores failed to load: ", err);
    $scope.loaded = true;
    $scope.error = true;
  });
});