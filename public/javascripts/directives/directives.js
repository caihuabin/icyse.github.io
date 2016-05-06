'use strict';

var directives = angular.module('icyse-blog.directives', ['icyse-blog.configs']);

directives.directive('markDown', ['$sce', function($sce){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl){
            var renderer = new marked.Renderer();
            renderer.heading = function (text, level) {
                return '<h' + level + '>' + text + '</h' + level + '>';
            },
            scope.$watch(attrs.ngModel, function() {
                if(scope.post && scope.post.content){
                    scope.previewContent = $sce.trustAsHtml(marked(scope.post.content, {sanitize: true, renderer: renderer}));
                }
            });
        }
    }
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
directives.directive('lazyLoad', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].onload = function(){
                element[0].classList.add('show');
            }
        }
    }
}]);
directives.directive('menuPopup', ['$window', 'CATEGORY_LIST', function ($window, CATEGORY_LIST) {
    return {
        restrict: 'A',
        scope: {},
        template:   '<ul class="pure-menu pure-menu-horizontal">\
                        <li class="pure-menu-item"><a ng-href="/#/" class="pure-menu-link tooltipped tooltipped-s" aria-label="Home"><span class="icon-home"></span></a></li>\
                        <li class="pure-menu-item"><a href="javascript:;" ng-click="toggle=!toggle" class="pure-menu-link tooltipped tooltipped-s" aria-label="Menu"><span class="icon-leaf"></span></a></li>\
                        <li class="pure-menu-item"><a ng-href="/#/about" class="pure-menu-link tooltipped tooltipped-s" aria-label="About" href="/#/about"><span class="icon-user"></span></a></li>\
                        <li class="pure-menu-item"><a href="http://github.com/icyse/" class="pure-menu-link tooltipped tooltipped-s" aria-label="GitHub"><span class="icon-github-circled"></span></a></li>\
                    </ul>\
                    <ul ng-show="toggle" class="flip-in category-popup">\
                        <li ng-repeat="category in categoryList"><a class="post-category post-category-{{category}}" ng-href="/#/?category={{category}}">{{category}}</a></li>\
                    </ul>',
        link: function (scope) {
            scope.categoryList = CATEGORY_LIST;
            scope.toggle = false;
        }
    };
}]);
directives.directive('focus', function() {
    return {
        link: function(scope, element, attrs) {
            element[0].focus();
        }
    };
});