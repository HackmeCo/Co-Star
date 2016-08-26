angular.module('costars', [
  'costars.home',
  'ngRoute'])

.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/home.html',
      controller: 'HomeController'
    })
    .otherwise({
      redirectTo: '/'
    })
})

.run(){}