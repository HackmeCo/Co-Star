
angular.module('costars.home' , [])

//THE CONTROLLER FOR THE ENTIRE COSTARS WEBSITE

.controller('HomeController', function($scope, $location, $sce, $http, ApiCalls, DB, PirateShip) {
  $scope.movies = []; //the movies we're currently displaying
  $scope.currentSearches = []; //array of actor objects, stored as {name: String, id: Number, profile_path: String, popularity: Number}
  $scope.actorIds = []; //it will be a list of ids
  $scope.rules = true; //rules display if this is true
  $scope.loaded = true; //displays loading gif if false
  $scope.netflixData = []; // will be an array of object with info about netflix 
  $scope.notOnNetflix = true; // means button won't work until false;
  $scope.showIFrame = false; // don't display iframe on load
  $scope.youtube404 = false;

  //getMovies is called every time an actor is removed or added to the list
  $scope.getMovies = function (){
    if(!$scope.currentSearches.length){
      $scope.movies = []; //Empty the movie list
      $scope.actorIds = []; //Shouldn't be necessary (should already be removed), just a precaution
      return; 
    }
    if($scope.currentSearches.length === 1){
      //api call for one persons stuff
      //console.log("In getMovies, length is one, about to make DB call for: ", $scope.currentSearches[0].name);
      return DB.getActor($scope.currentSearches[0].name)
      .then(function(data){
        //console.log('DB call getActor retrieved: ', data);
        //console.log("Setting $scope.movies to: ", data.known_for);
        // adds pirate links for movies currently in DB
        data.known_for.forEach(function(val){ //*** val.original_title
          // set data from netflix call
          val.onNetflix = false;
          val.external_id = 0;

          ApiCalls.netflix(val.original_title)
          .then(function(netflixInfo){
            val.onNetflix   = netflixInfo.data.available;
            val.external_id = netflixInfo.data.netflixId;
           // PirateShip.getAndVerifyLink(val);
            console.log('object after netflix call', data.known_for);
            $scope.loaded   = true;
          })
        })
            $scope.movies = data.known_for; 
      })
      .catch(function(){
        //wasn't in the data base so do an api call, this probably means there's a DB error
        // console.log("In getMovies, length is one, DB call failed, make API call");
        ApiCalls.searchByPerson($scope.currentSearches[0].name)
        .then(function(data){
          //posts retrieved info to the database
          if(data.results[0].profile_path){ //don't store if they don't have a picture
            $scope.storeActorDb(data.results[0]);
          }
          data.results[0].known_for.forEach(function(val){ //*** val.original_title
          // set data from netflix call
          val.onNetflix = false;
          val.external_id = 0;

          ApiCalls.netflix(val.original_title)
          .then(function(netflixInfo){
            $scope.loaded    = true;
            val.onNetflix   = netflixInfo.data.available;
            val.external_id = netflixInfo.data.netflixId;
            //PirateShip.getAndVerifyLink(val);
            console.log('object after netflix call', data.results[0].known_for);
          })
        })
            $scope.movies = data.results[0].known_for; 
          })
          .catch(function(err){
            console.error("Error making SBP call: ", err);
            $scope.loaded = true;
          }) ;
      });
    }
    else{ //list contains multiple actors, we need to make a "discover" call
      return ApiCalls.discover($scope.actorIds)
        .then(function(movies) {
          // console.log("Movies from discover call: ", movies);
          movies.forEach(function(val){ //*** val.original_title
          // set data from netflix call
          val.onNetflix = false;
          val.external_id = 0;

          ApiCalls.netflix(val.original_title)
          .then(function(netflixInfo){
            $scope.loaded   = true;
            val.onNetflix   = netflixInfo.data.available;
            val.external_id = netflixInfo.data.netflixId;
            //PirateShip.getAndVerifyLink(val);
            console.log('object after netflix call', movies[0]);
          })
        })
            $scope.movies = movies; 
        })
        .catch(function(error) {
          console.error("Error making discover call: ", error);
          $scope.loaded = true;
        });
    }
    
  };

  /*
  * Shows the movie overview, called when the mouse enters the movie display
  */
  $scope.showOverview = function(movie){
    movie.showOverview = true;
  };
  /*
  * Hides the movie overview, called when the mouse leaves the movie display
  */
  $scope.hideOverview = function(movie){
    movie.showOverview = false;
  };

  /*
  * Posts information to our database
  * @param data should be an object, formatted the same as the "results" returned from a SBP API call
  */
  $scope.storeActorDb = function(data){
    console.log('Store actor Db: ',data);
   // PirateShip.getAndVerifyLink(data.known_for[0]);
    //console.log('storeActorDb:',data.known_for[0]);
    return DB.storeActor(data)
      .then(function(resp){
        // console.log("actor stored",resp);
      })
      .catch(function(error){
        console.error("Error storing actor:",error);
      });
  };

  /*
  * Function called whenever a user clicks the "add actor" button
  * Formats the input, then searches the database, then makes an API call if necessary
  * After DB call or API call is successful, the actor's information is stored to the in-memory variables
  * Calls $scope.getMovies to refresh the movie list after completion
  * @param actorInput - The input from the text box, as a string (should be an actor's name)
  */

  $scope.addActorInput = function (actorInput){
    $scope.loaded = false;
    actorInput = actorInput.trim();
    actorInput = actorInput.replace(/\s+/g, ' '); //trim down whitespace to single spaces, in case of typos
    actorInput = actorInput.split(' ').map(function(actorName){
      actorName = actorName.toLowerCase();
      return actorName.charAt(0).toUpperCase() + actorName.slice(1); //Capitalize first letter
    }).join(' '); //format all names the same    

    DB.getActor(actorInput)
    .then(function(actorData){
      // console.log("In addActorInput, got back from DB: ", actorData);
      $scope.actorIds.push(actorData.id); //add the id to our list
      for(var i = 0; i < $scope.currentSearches.length; i++){
        if($scope.currentSearches[i].name === actorData.name){ //already searching for this actor
          alert(actorData.name + " is already in the list");
          return;
        }
      }
      $scope.currentSearches.push({
        name: actorData.name,
        id: actorData.id,
        profile_path: actorData.profile_path,
        popularity: actorData.popularity
      }); //add the actor to our current searches
      // console.log("In addActorInput, before getMovies call, currentSearches: ", $scope.currentSearches);
      if($scope.currentSearches.length === 1){
        actorData.known_for.forEach(function(val){ //*** val.original_title
        // set data from netflix call
          val.onNetflix = false;
          val.external_id = 0;

          ApiCalls.netflix(val.original_title)
          .then(function(netflixInfo){
            $scope.loaded    = true;
            val.onNetflix   = netflixInfo.data.available;
            val.external_id = netflixInfo.data.netflixId;
            //PirateShip.getAndVerifyLink(val);
            console.log('object after netflix call', actorData.known_for);
          })
        })
        $scope.movies = actorData.known_for; 
      }else{
        $scope.getMovies();
      }
      $scope.actorInput = '';
    })
    .catch(function(err){ //not found in DB
      // console.log("Didn't find " + actorInput + " in database, making API call");
      ApiCalls.searchByPerson(actorInput)
      .then(function(actorData){
        if(!actorData.results.length){ //not found
          alert(actorInput + " not found!"); //TODO: make a better way to display this error
          //no need to getMovies here, list shouldn't have changed
        }else{
          $scope.actorIds.push(actorData.results[0].id); //add the id to our list
          for(var i = 0; i < $scope.currentSearches.length; i++){
            if($scope.currentSearches[i].name === actorData.results[0].name){ //already searching for this actor
              alert(actorData.results[0].name + " is already in the list");
              return;
            }
          }
          $scope.currentSearches.push({
            name: actorData.results[0].name,
            id: actorData.results[0].id,
            profile_path: actorData.results[0].profile_path,
            popularity: actorData.results[0].popularity
          }); //store the actor name
          if(actorData.results[0].profile_path){
            $scope.storeActorDb(actorData.results[0]) //store the data
            .then(function(resp){
              $scope.actorInput = '';
              $scope.getMovies(); //get the movies for the current actor list
            })
            .catch(function(err){
              console.error("Error storing to database (in addActorInput): ", err);
              $scope.getMovies(); //still want to retrieve movies
            });
          } else{
            // console.log("Didn't add this actor to database; (s)he has no picture");
            $scope.getMovies();
          }
        }
      })
      .catch(function(err){
        console.error("Error getting actor from tmDB: ", err);
      });
    });
  };

  /*
  * Removes an actor from our list and refreshes the movie list
  * @param actor an actor object, as stored in $scope.currentSearches
  */

  $scope.removeActorInput = function(actor){
    $scope.loaded = false;
    var index = $scope.currentSearches.indexOf(actor);
    if(index>=0){
      $scope.currentSearches.splice(index, 1);
      $scope.actorIds.splice(index, 1);
      $scope.getMovies();
      $scope.loaded = true;
    }else{
      console.error("Error finding actor in list");
    }
  };

  $scope.detailFrame = undefined;

  $scope.watchTrailer = function(movieInfo){
    $scope.showIFrame = true; // display iframe on trailer click
    console.log("make tmdb request with this id: ", movieInfo.id);
    ApiCalls.searchByID(movieInfo.id)
    .then(function(resp){
      // searchByID returns a promise which is resolved to the youtube key as resp
      $scope.detailFrame = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + resp + "?autoplay=1");
      $scope.youtube404 = false;

    })
    .catch(function(err){
      var rickRoll = "dQw4w9WgXcQ";
      $scope.youtube404 = true;
      setTimeout(function(){
        $scope.youtube404 = false;
        console.log('timout true or false: ', $scope.youtube404);
      }, 4000);
      $scope.detailFrame = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + rickRoll + "?autoplay=1");
      //alert("Sorry, No original trailer could be found");
    });
  };

  $scope.watchForFree = function(movieInfo){
    PirateShip.getAndVerifyLink(movieInfo).then(resp=>{
      $scope.showIFrame = true; // display iframe on pirate click
      $scope.youtube404 = false;
      console.log("pirate source is: ", movieInfo.pirate_src);
      $scope.detailFrame = $sce.trustAsResourceUrl(movieInfo.pirate_src);
    });
    
    // window.open("http://putlocker.is/watch-" + movie.split(' ').join('-').split(':').join('').split('&').join('and') + "-online-free-putlocker.html", '_blank');
  };

  $scope.watchOnNetflix = function(movieInfo){
    $scope.youtube404 = false;
    var id = movieInfo.external_id
    window.open("http://www.netflix.com/watch/" + id);
  };

  $scope.buyOnItunes = function(movieTitle){
    console.log("Link clicked to watch " + movieTitle + " on Amazon.")
    $http.jsonp("https://itunes.apple.com/search?callback=JSON_CALLBACK&media=movie&entity=movie&limit=1&explict=yes&term=" + movieTitle.split(' ').join('+').split(':').join('').split('&').join('and'))
      .then(function(response) {
        var itunesUrl = response.data.results[0].trackViewUrl;
        console.log('itunes api call: ', itunesUrl);
        window.open(itunesUrl);
    })
      // $scope.detailFrame = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + videoId + "?autoplay=1");
        // $scope.myWelcome = response.data;
    // window.open("http://www.netflix.com/search/" + movie.split(' ').join('-'));
    // The following line needs to be changed to work with amazon maybe???
    // window.open("http://www.netflix.com/search/" + movie.split(' ').join('-'));
  };

  $scope.startGame = function(){
    $scope.playing = !$scope.playing;
  };

  $scope.showRules = function(){
    $scope.rules = !$scope.rules;
  };
  
  $scope.goToGame = function(){
   $location.path("/game");
  };

  $scope.enableNetflix = function(){
    $scope.notOnNetflix = false; // to make button work
  };

  $scope.disableNetflix = function(){
    $scope.notOnNetflix = true; // disable button
  };

}); //END OF CONTROLLER