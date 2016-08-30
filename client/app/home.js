
angular.module('costars.home' , [])

//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $http, ApiCalls, DB) {
  $scope.movies = []; //the movies we're currently displaying
  $scope.currentSearches = []; //array of actor objects, stored as {name: String, id: Number, profile_path: String, popularity: Number}
  $scope.actorIds = []; //it will be a list of ids
  //getMovies is called every time an actor is removed or added to the list
  $scope.getMovies = function (){
    if(!$scope.currentSearches.length){
      $scope.movies = []; //Empty the movie list
      $scope.actorIds = []; //Shouldn't be necessary, just a precaution
      return; 
    }
    if($scope.currentSearches.length === 1){
      //api call for one persons stuff
      console.log("In getMovies, length is one, about to make DB call")
      return DB.getActor($scope.currentSearches[0].name)
      .then(function(data){
        console.log('1 actor only data', data);
        $scope.movies = data.known_for; //set it to the well known movies
      })
      .catch(function(){
        //wasn't in the data base so do an api call, this probably means there's a DB error
        console.log("In getMovies, length is one, DB call failed, make API call");
        ApiCalls.searchByPerson($scope.currentSearches[0].name) // maybe .then( display stuff)\
          .then(function(data){
            //show at the data once obtained!!
            //stores all the information given in the database
          $scope.storeActorDb(data.results[0]);
          $scope.movies = data.results[0].known_for;
          })
          .catch(function(err){
            console.log("Error making SBP call: ", err);
          }) 
      })
    }
    else{
      return ApiCalls.discover($scope.actorIds)
        .then(function(movies) {
          console.log("Movies from discover call: ", movies);
          $scope.movies = movies;
        })
        .catch(function(error) {
          console.log("couldn't search multiple actors: ", error);
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
    actorInput = actorInput.split(' ').map(function(actorName){
      actorName = actorName.toLowerCase();
      return actorName.charAt(0).toUpperCase() + actorName.slice(1); //Capitalize first letter
    }).join(' '); //format all names the same
    
    for(var i = 0; i < $scope.currentSearches.length; i++){
      if($scope.currentSearches[i].name === actorInput){ //already searching for this actor
        alert(actorInput + " is already in the list")
        return;
      }
    }

    DB.getActor(actorInput)
    .then(function(actorData){
      $scope.actorIds.push(actorData.id); //add the id to our list
<<<<<<< 826ea149d6487e09ee2829b6f6b4a0bc0df8af54
      $scope.currentSearches.push({
        name: actorData.name,
        id: actorData.id,
        profile_path: actorData.profile_path,
        popularity: actorData.popularity
      }) //add the actor to our current searches
=======
      $scope.currentSearches.push(actorData.name) //add the name to our current searches
>>>>>>> Now autocompletes names in current searches
    })
    .catch(function(err){ //not found in DB
      console.log("Didn't find " + actorInput + " in database, making API call");
      ApiCalls.searchByPerson(actorInput)
      .then(function(actorData){
        if(!actorData.results.length){ //not found
          alert(actorInput + " not found!") //TODO: make a better way to display this error
          //no need to getMovies here, list shouldn't have changed
        }else{
          $scope.actorIds.push(actorData.results[0].id); //add the id to our list
<<<<<<< 826ea149d6487e09ee2829b6f6b4a0bc0df8af54
          $scope.currentSearches.push({
            name: actorData.results[0].name,
            id: actorData.results[0].id,
            profile_path: actorData.results[0].profile_path,
            popularity: actorData.results[0].popularity
          }) //store the actor name
=======
          $scope.currentSearches.push(actorData.results[0].name) //store the actor name
>>>>>>> Now autocompletes names in current searches
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
      .catch(function(err){
        console.log("Error getting actor from tmDB: ", err);
      })
    }) 
  }

  //removing the actor from the view and currentSearches Array
  //actor is the specific actor clicked on the page
  $scope.removeActorInput = function(actor){
    var index = $scope.currentSearches.indexOf(actor);
    if(index>=0){
      $scope.currentSearches.splice(index, 1);
      $scope.actorIds.splice(index, 1);
      $scope.getMovies();
    }else{
      console.log("removing actor input failed");
    }
  }
}) //END OF CONTROLLER