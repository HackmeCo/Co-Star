
angular.module('costars.home' , [])

//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $http, ApiCalls)) {
  //$scope.data = {}; will need for movies
  $scope.currentSearches = []; //array of actors with associated ids. 
  $scope.actorIds = []; //it will be a mapping of actor names to ids.


  //getMovies is called every time an actor is removed or added to the list
  $scope.getMovies = function (){
    if($scope.currentSearches.length === 1){
      //api call for one persons stuff
      ApiCalls.searchByPerson($scope.currentSearches[0]); // maybe .then( display stuff)
    }
    else{
      var promise = [];
      for( let i = 0; i < currentSearches.length; i++){
        
        promise.push(getActor(currentSearches[i])
        .then(function(data){
          $scope.ids.push(data.id);
        })
        .catch(function(){
          $scope.ids.push(ApiCalls.searchByPerson($scope.currentSearches[i]));
        }));
        //currently i'm assumming that searchbyPerson is going to return an actors id.
      }
      Promise.all(promise).then(function(){

      ApiCalls.discover($scope.actorIds);
        
      });
    }
    
    
  };
  // adding selected actor to the view and the currentSearches Array
  //actorInput is the input that the user gave us 
  $scope.addsActorInput = function (actorInput){
    $scope.currentSearches.push(actorInput);
    //eventually we will call getMovies here. AV EC KH 
    $scope.getMovies();

    

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

