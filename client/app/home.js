
angular.module('costars.home' , [])

//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $http, ApiCalls, DB) {
  //$scope.data = {}; will need for movies
  $scope.currentSearches = []; //array of actor names
  $scope.actorIds = []; //it will be a list of ids
  //getMovies is called every time an actor is removed or added to the list
  $scope.getMovies = function (){
    if($scope.currentSearches.length === 1){
      //api call for one persons stuff
      console.log("In getMovies, length is one, about to make DB call")
      return DB.getActor($scope.currentSearches[0])
      .then(function(data){
        console.log('1 actor only data', data)
        $scope.actorIds.push(data.id); //add the id to the list
        //show this data!!
      })
      .catch(function(){
        //wasn't in the data base so do an api call
        console.log("In getMovies, length is one, DB call failed, make API call");
        ApiCalls.searchByPerson($scope.currentSearches[0]) // maybe .then( display stuff)\
          .then(function(data){
            //show at the data once obtained!!
            //stores all the information given in the database
          $scope.actorIds.push(data.id); //add the id to our list for discover calls
          $scope.storeActorDb(data);
          })
          .catch(function(err){
            console.log("Error making SBP call: ", err);
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
            $scope.actorIds.push(data.id);
          })
          //if we dont get any data back, api call time
          .catch(function(){
            ApiCalls.searchByPerson($scope.currentSearches[i])
              .then(function(data){
              //assuming that data.id is id. DOUBLE CHECK THAT!!
                var id = data.id
                $scope.actorIds.push(id);
                //we need to store the new information in the database
                $scope.storeActorDb(data);
              })
          })  
        );
      }
      //promise.all your promises.
      return Promise.all(promise)
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
  //calls on storeActor from factories and makes it a promise
  $scope.storeActorDb = function(data){
    return DB.storeActor(data)
      .then(function(resp){
        console.log("actor stored",resp);
      })
      .catch(function(error){
        console.log("actor not stored:",error);
      });
  };

  // adding selected actor to the view and the currentSearches Array
  //actorInput is the input that the user gave us 
  $scope.addActorInput = function (actorInput){
    actorInput = actorInput.trim();
    actorInput = actorInput.replace(/\s+/g, ' '); //trim down whitespace to single spaces, in case of typos
    $scope.currentSearches.push(actorInput);

    DB.getActor(actorInput)
    .then(function(actorData){
      actorIds.push(actorData.id); //add the id to our list
    })
    .catch(function(err){ //not found in DB
      console.log("Didn't find " + actorInput + "in database, making API call");
      ApiCalls.searchByPerson(actorInput)
      .then(function(actorData){
        if(!actorData.results.length){ //not found
          alert(actorInput + "not found!") //TODO: make a better way to display this error
          $scope.currentSearches.pop(); //remove from searches
          //no need to getMovies here, list shouldn't have changed
        }else{
          actorIds.push(actorData.results[0].id); //add the id to our list
          $scope.storeActorDb(actorData.results[0]) //store the data
          .then(function(resp){
            $scope.getMovies(); //get the movies for the current actor list
          })
          .catch(function(err){
            console.log("Error storing to database (in addActorInput): ", err);
            $scope.getMovies() //still want to retrieve movies
          })
        }
      })
    }) 
  }

  //removing the actor from the view and currentSearches Array
  //actor is the specific actor clicked on the page
  $scope.removesActorInput = function(actor){
    var index = $scope.currentSearches.indexOf(actor);
    if(index>=0){
      $scope.currentSearches.splice(index, 1);
      $scope.getMovies();
    }else{
      console.log("removing actor input failed");
    }
  }
}) //END OF CONTROLLER

