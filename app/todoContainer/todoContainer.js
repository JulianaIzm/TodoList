'use strict';

angular.module('myApp.todoContainer', ['myApp.dragdrop'])
.directive('todo', function() {
  return {
    restrict: 'E',
    scope: {
      clear: '=',
    },
    templateUrl: 'todoContainer/todoContainer.html',
  };
})
.controller('todoCtrl', ['$scope', '$window', '$document', '$timeout', function($scope, $window, $document, $timeout) {
//этот код работает с resize, но не работает с load and DOMContentLoaded!!!
//   angular.element($window).on('resize', function () {
//     $scope.getTodos();
// });

  $scope.date = new Date();
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $scope.day = weekday[$scope.date.getDay()];

  var allMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  $scope.month = allMonths[$scope.date.getMonth()];
  $scope.month.toUpperCase();

  $scope.inputText = '';
  $scope.setCurrentText = function(text) {
    $scope.inputText = text;
  };

  $scope.tasks = [];
  $scope.readyTasks = [];
  
  $scope.send = function(text) {
    $scope.tasks.push(text);
    // $scope.saveTodosToLS(text);
    $scope.updateLS();
    // $scope.updateLS();
  };
  
  $scope.todos= [];

  $scope.checkLS = function() {
    if($window.localStorage.getItem('todos') === null) {
      $scope.todos = [];
    } else {
      $scope.todos = JSON.parse($window.localStorage.getItem('todos'));
    }
  };

  $scope.saveTodosToLS = function(todo) {
    $scope.checkLS();
    $scope.todos.push(todo);
    $window.localStorage.setItem('todos', JSON.stringify($scope.todos));
  };

  $scope.getTodos = function() {
    $scope.checkLS();
    $scope.todos.forEach(function(todo) {
    $scope.tasks.push(todo);
    });
  };

  $scope.updateLS = function() {
    $scope.todosEl = angular.element($document).find('li');
    $timeout(function() {
      $scope.todosEl.forEach(todoEl => {
        $scope.todos.push({
          text: todoEl.innerText,
          completed: todoEl.hasClass('done')
        });
    })}, 3000);

      $window.localStorage.setItem('todos', JSON.stringify($scope.todos));
  };

 
  //   if ($window.localStorage.getItem('todos')) {
  //     $scope.todosFromLocalStorage = JSON.parse($window.localStorage.getItem('todos'));
  //     $scope.todos = $scope.todosFromLocalStorage.map(t => {
  //       return {
  //         id: t.id,
  //       };
  //     });
  //   } else {
  //     this.todos = [];
  //   }
  // };

  // $scope.saveDataToLocalStorage = function(data, keyName) {
  //   var a = [];
  //   // Parse the serialized data back into an aray of objects
  //   a = JSON.parse($window.localStorage.getItem(keyName)) || [];
  //   // Push the new data (whether it be an object or anything else) onto the array
  //   a.push(data);
  //   // Re-serialize the array back into a string and store it in localStorage
  //   $window.localStorage.setItem(keyName, JSON.stringify(a));
  // };
  // // $scope.getTodos = function() {
  //   
    
    // 
  // };

  $scope.removeFromLS = function(todo) {
    $scope.checkLS();
    var index = $scope.tasks.indexOf(todo);
    $scope.todos.splice(index, 1);
    $window.localStorage.setItem('todos', JSON.stringify($scope.tasks));
  };

  $scope.clean = function(e) {
    $scope.tasks = [];
    $scope.readyTasks = [];
    $window.localStorage.clear();
  };

  $scope.dropSuccessHandler = function(index,array){
    array.splice(index,1);
};
  $scope.onDrop = function($data, array, el){
    array.unshift($data);
    $scope.existing = JSON.parse($window.localStorage.getItem('todos'));
    $scope.todoIndex = $scope.existing.findIndex(t => t.id === id);
    // Add new data to localStorage Array
    $scope.existing[$scope.todoIndex].name = $data;
    // Save back to localStorage
    $window.localStorage.setItem('todos', JSON.stringify($scope.existing));
    // Get Updated Tasks
    $scope.getTasks();
  };
  //   var indexEl = $scope.todos.map(function(d) { return d['element']; }).indexOf(el.id);
  //   if (indexEl>-1)
  //     $scope.todos.splice(indexEl, 1);
  //     $window.localStorage.setItem('todos', JSON.stringify($scope.todos));
  // };
}])

.directive('autoScroll', function () {
  return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrls) {
          var scrollToBottom = function () {
              element[0].scrollTop = element[0].scrollHeight;
          };
          scope.$watchCollection('messages', scrollToBottom);
      }
  };
});