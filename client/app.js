angular.module('costars', [
  'costars.factories',
  'costars.home',
  'costars.game',
  'ngRoute'])

.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/home.html',
      controller: 'HomeController'
    })
    .when('/game', {
      templateUrl: 'app/game.html',
      controller: 'GameController'
    })
    .otherwise({
      redirectTo: '/'
    })
})

.run()