"use strict";

angular.module("myApp.dragdrop", ['myApp.lvl.services'])

.directive('lvlDraggable', ['$rootScope', 'uuid', '$parse', function($rootScope, uuid, $parse) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs, controller) {

            angular.element(el).attr("draggable", "true");
            var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            }

            var dragData = "";
            scope.$watch(attrs.drag, function (newValue) {
                dragData = newValue;
            });
            
            el.bind("dragstart", function(e) {
                // var sendData = angular.(dragData);
                e.dataTransfer.setData('text', dragData);
                $rootScope.$emit("LVL-DRAG-START");
                // console.log('drag start', dragData);
            });
            
            el.on("dragend", function(e) {
                $rootScope.$emit("LVL-DRAG-END");
                console.log('drag end');
                if (e.dataTransfer && e.dataTransfer.dropEffect !== "none") {
                    if (attrs.onDropSuccess) {
                        var fn = $parse(attrs.onDropSuccess);
                        scope.$apply(function () {
                            fn(scope, {$event: e});
                        });
                    }
                }
            });
        }
    };
}])

.directive('dropTarget', ['$rootScope', 'uuid', '$parse', function($rootScope, uuid, $parse) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs, controller) {
            var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            }

            el.bind("dragover", function(e) {
                if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
                console.log('drag over');
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });
            
            el.bind("dragenter", function(e) {
              // this / e.target is the current hover target.
                angular.element(e.target).addClass('lvl-over');
            });
            
            el.bind("dragleave", function(e) {
                angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
            });
            
            el.bind("drop", function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropogation) {
                e.stopPropogation(); // Necessary. Allows us to drop.
                }
                
                var data = e.dataTransfer.getData("text");
                var fn = $parse(attrs.dropTarget);
                scope.$apply(function () {
                    fn(scope, {$data: data, $event: e});
                    angular.element(e.target).removeClass('lvl-over');
                    angular.element(e.target).addClass('doneTask');
                });
            });

            $rootScope.$on("LVL-DRAG-START", function() {
                var el = document.getElementById(id);
                angular.element(el).addClass("lvl-target");
            });
            
            $rootScope.$on("LVL-DRAG-END", function() {
                var el = document.getElementById(id);
                angular.element(el).removeClass("lvl-target");
                angular.element(el).removeClass("lvl-over");
            });
        }
    };
}]);