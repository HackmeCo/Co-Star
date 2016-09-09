angular.module('costars', [
  'costars.factories',
  'costars.home',
  'costars.game',
  'costars.leaderboard',
  'ngRoute',
  'ng-fx',
  'ngAnimate'
])

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
    .when('/leaderboard', {
      templateUrl: 'app/leaderboard.html',
      controller: 'LeaderboardController'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.run();