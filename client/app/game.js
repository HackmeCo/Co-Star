angular.module('costars.game' , [])

.controller('GameController', function(ApiCalls, DB, $scope, $location){
  $scope.score;
  $scope.movieChoices;
  $scope.submitChoice(movie);
})