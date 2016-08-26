
angular.module('costars.home' , [])

//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $http, ApiCalls, DB)) {
  //$scope.data = {}; will need for movies
  $scope.currentSearches = []; //array of actors with associated ids. 
  $scope.actorIds = []; //it will be a mapping of actor names to ids.


  //getMovies is called every time an actor is removed or added to the list
  $scope.getMovies = function (){
    if($scope.currentSearches.length === 1){
      //api call for one persons stuff
      ApiCalls.searchByPerson($scope.currentSearches[0]) // maybe .then( display stuff)\
        .then(function(data){
          //stores all the information given in the database
          DB.storeActor(data)
          .then(function(resp){
            //must .then a promise.
            console.log("actor information stored");
            console.log('resp', resp);
          })
        }) 
    }
    else{
      //need a promise array so we can .then the for loop
      var promise = [];
      //loop through all the current searches
      for( let i = 0; i < currentSearches.length; i++){
        //get your actor information from the database
        promise.push(DB.getActor(currentSearches[i])
          .then(function(data){
            $scope.ids.push(data.id);
          })
          //if we dont get any data back, api call time
          .catch(function(){
            ApiCalls.searchByPerson($scope.currentSearches[i])
              .then(function(data){
              //assuming that data.id is id. DOUBLE CHECK THAT!!
                var id = data.id
                $scope.ids.push(id)
                //we need to store the new information in the database
                DB.storeActor(data)
                  .then(function(){
                    //it worked
                    console.log("data stored")
                  })
                  .catch(function(err){
                    //it failed
                    console.log("we have an error", err);
                  })
              })
          })  
        );
      }
      //promise.all your promises.
      Promise.all(promise)
        .then(function(){
          //make discover api call finally
          ApiCalls.discover($scope.actorIds)
            .then(function(data){
              //eventually we need to show the data here!!!
              console.log("DATA FROM DISCOVER CALL", data);
            });
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

