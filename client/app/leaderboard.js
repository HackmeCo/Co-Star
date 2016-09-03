angular.module('costars.leaderboard', [])

.controller('LeaderboardController', function($scope, Leaderboard, $location){
  $scope.goToGame = function(){
    $location.path("/game");
  }
  $scope.goToHome = function(){
    $location.path("/");
  }
  $scope.scores = [];
  $scope.loaded = false;
  $scope.error = false;

  Leaderboard.getScores() //fetch high scores
  .then(function(data){
    $scope.error = false;
    $scope.scores = data;
    $scope.loaded = true;
  })
  .catch(function(err){
    console.log("Scores failed to load: ", err);
    $scope.loaded = true;
    $scope.error = true;
  })
})