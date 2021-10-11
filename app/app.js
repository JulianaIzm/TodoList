'use strict';
angular.module('myApp', [
  'myApp.todoContainer',
  'myApp.dragdrop',
  'myApp.addTodo',
  'myApp.service',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/todoContainer'});
}]);
