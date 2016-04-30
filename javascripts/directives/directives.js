'use strict';

var directives = angular.module('mean.directives', ['mean.configs']);

directives.directive('markDown', ['$sce', function($sce){
    return {
        restrict: 'A',
        link: function(scope){
            if(scope.post.content){
                scope.previewContent = $sce.trustAsHtml(markdown.toHTML(scope.post.content));
            }
        }
    }
}]);

directives.directive('menuLink', ['$window', 'DOM_EVENTS', function($window, DOM_EVENTS) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var elem = element[0];

            elem[DOM_EVENTS.onclick] = function(e){
                var active = 'active';
                e.preventDefault();
                $window.document.getElementById('layout').classList.toggle(active);
                $window.document.getElementById('menu').classList.toggle(active);
                this.classList.toggle(active);
            };
            
        }
    };
}]);
directives.directive('whenScrolled', ['DOM_EVENTS', 'CUSTOM_EVENTS', '$window', function(DOM_EVENTS, CUSTOM_EVENTS, $window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var elem = element[0];
            var documentElement = $window.document.documentElement;
            var body = $window.document.body;
            var bindScroll = function(){
                IsScrollToBottom() && scope.$broadcast(CUSTOM_EVENTS.loadMore);
            };
            elem[DOM_EVENTS.onscroll] = bindScroll;
            scope.$on(CUSTOM_EVENTS.loading, function(){
                elem[DOM_EVENTS.scroll] = null;
            });
            scope.$on(CUSTOM_EVENTS.loaded, function(){
                elem[DOM_EVENTS.scroll] = bindScroll;
            });

            function IsScrollToBottom() {
                var scrollTop = 0;  
                var clientHeight = 0;
                var scrollHeight = Math.max(body.scrollHeight, documentElement.scrollHeight) || 0;  
                if (documentElement && documentElement.scrollTop) { 
                    scrollTop = documentElement.scrollTop; 
                } else if (body) {
                    scrollTop = body.scrollTop;
                }  
                if (body.clientHeight && documentElement.clientHeight) {  
                    clientHeight = (body.clientHeight < documentElement.clientHeight) ? body.clientHeight: documentElement.clientHeight;  
                } else {  
                    clientHeight = (body.clientHeight > documentElement.clientHeight) ? body.clientHeight: documentElement.clientHeight;  
                }
                return scrollTop + clientHeight >= scrollHeight ? true : false;
            }
        }
    };
}]);
directives.directive('scrollTo', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var documentElement = $window.document.documentElement;
            var body = $window.document.body;
            
            scope.scrollTo = function(pos){
                if(pos === 0){
                    body.scrollTop = 0;
                    documentElement.scrollTop = 0;
                }
                else if(pos === -1){
                    var scrollHeight = Math.max(body.scrollHeight, documentElement.scrollHeight) || 0;
                    var clientHeight = 0;
                    if (body.clientHeight && documentElement.clientHeight) {
                        clientHeight = (body.clientHeight < documentElement.clientHeight) ? body.clientHeight: documentElement.clientHeight;  
                    } else {  
                        clientHeight = (body.clientHeight > documentElement.clientHeight) ? body.clientHeight: documentElement.clientHeight;  
                    }
                    body.scrollTop = scrollHeight - clientHeight;
                    if(!body.scrollTop){
                    	documentElement.scrollTop = scrollHeight - clientHeight;
                    }
                }
            }
        }
    }
}]);
directives.directive('scrollInto', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.scrollInto = function(){
                $window.document.getElementById(attrs.scrollInto).scrollIntoView();
            }
        }
    }
}]);
directives.directive('focus', function() {
    return {
        link: function(scope, element, attrs) {
            element[0].focus();
        }
    };
});