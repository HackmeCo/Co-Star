angular.module('costars.leaderboard', [])

.controller('LeaderboardController', function($scope, Leaderboard, $window, $location){
  $scope.goToGame = function(){
    $window.location.href = "/#/game";
  }
  $scope.scores = [];
  $scope.loaded = false;

  Leaderboard.getScores()
  .then(function(data){
    $scope.scores = data;
    $scope.loaded = true;
    $scope.$apply();
  })
})