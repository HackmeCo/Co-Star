"use strict"

//Testing calls to the database (how the client handles calls)

describe("The Thespian Database", function(){
  var $scope, $rootScope, createController, DB, $httpBackend;

  beforeEach(module('costars')); //costars will have to be our routing module
  beforeEach(inject(function($injector) { 

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    DB = $injector.get('DB');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('HomeController', {
        $scope: $scope,
        DB: DB
      });
    };

  }));


})

