home.js
angular.module(costars.home , [])
//i changed
//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $http)) {
  $scope.data = {};
  $scope.currentSearches = [];
  $scope.getMovies = function (actorInput){
    //some kind of api call
    //TODO:
    .then(function(data){
      //do stuff


    })

  }
  // adding selected actor to the view and the currentSearches Array
  //actorInput is the input that the user gave us 
  $scope.addsActorInput = function (actorInput){
    $scope.currentSearches.push(actorInput);

  }
  //removing the actor from the view and currentSearches Array
  //actor is the specific actor clicked on the page
  $scope.removesActorInput = function(actor){
    var index = $scope.currentSearches.indexOf(actor);
    if(index>=0){
      $scope.currentSearches.splice(index, 1);
    }else{
      console.log("removing actor input failed");
    }
  }

}

