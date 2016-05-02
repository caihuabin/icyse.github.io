'use strict';
var app = angular.module('mean', ['ngRoute', 'ngAnimate', 'pascalprecht.translate', 'mean.directives', 'mean.services', 'mean.configs', 'mean.filters']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$translateProvider', 'LOCALE_LANGUAGE', function($routeProvider, $locationProvider, $httpProvider, $translateProvider, LOCALE_LANGUAGE) {
    $routeProvider.
        when('/about',{
            templateUrl:'/views/about/index.html'
        }).when('/', {
            controller: 'BlogListCtrl',
            resolve: {
                posts: ["MultiPostLoader", function(MultiPostLoader) {
                    return MultiPostLoader();
                }]
            },
            templateUrl:'/views/blog/index.html'
        }).when('/:alias', {
            controller: 'BlogShowCtrl',
            resolve: {
                post: ["PostLoader", function(PostLoader) {
                    return PostLoader();
                }]
            },
            templateUrl:'/views/blog/show.html'
        }).otherwise({redirectTo:'/'});

        $translateProvider.translations('en_US', LOCALE_LANGUAGE.en_US);
        $translateProvider.translations('zh_CN', LOCALE_LANGUAGE.zh_CN);
        $translateProvider.preferredLanguage('en_US');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');

        /*$locationProvider.html5Mode(true);*/
}]);

app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
        NProgress.start();
        var routeData = !!next.$$route ? next.$$route.data : null;
        if(!!routeData){
        }
    });
    $rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
        NProgress.done();
    });
    $rootScope.$on('$routeChangeError', function(current, previous, rejection) {
        NProgress.done();
    });

}]);
app.controller('ApplicationController', ['$scope', '$rootScope', '$translate', 'CUSTOM_EVENTS', function ($scope, $rootScope, $translate, CUSTOM_EVENTS) {
    $scope.currentRoutePath = '/';
    $scope.$on('$routeChangeSuccess', function(evt, next, previous) {
        if(!!next.$$route){
            $scope.currentRoutePath = next.$$route.originalPath;
        }
    });
    $scope.changeLanguage = function (lang) {
        if(lang === 'en_US'){
            $translate.use('en_US');
            $rootScope.$broadcast(CUSTOM_EVENTS.changeLanguage, 'en_US');
        }
        else{
            $translate.use('zh_CN');
            $rootScope.$broadcast(CUSTOM_EVENTS.changeLanguage, 'zh_CN');
        }
    };
}]);

app.controller('BlogListCtrl', ['$scope', 'posts', 'CUSTOM_EVENTS', function($scope, posts, CUSTOM_EVENTS) {
    $scope.postsList = posts.data.slice(0, 2);
    $scope.$on(CUSTOM_EVENTS.loadMore, function(data){
        $scope.$emit(CUSTOM_EVENTS.loading);
        NProgress.start();
        setTimeout(function(){
            var len = $scope.postsList.length;
            $scope.postsList = $scope.postsList.concat(posts.data.slice(len, len+2));
            $scope.$apply();
            $scope.$emit(CUSTOM_EVENTS.loaded);
            NProgress.done();
        }, 800);
    });

}]);
app.controller('BlogShowCtrl', ['$scope', '$location', 'post', function($scope, $location, post) {
    $scope.post = post.data;
}]);

app.controller('CommentCtrl', ['$scope', 'Comment', function($scope, Comment) {
    $scope.comment = new Comment();
    $scope.save = function() {
        $scope.comment.$save(function(result) {
            var comment = result.data;
            $scope.post.commentList.push(comment);
            ++$scope.post.commentCount;
        }, function(result){
        });
    };
}]);