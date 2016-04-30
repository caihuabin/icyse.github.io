'use strict';
var app = angular.module('mean', ['ngRoute', 'ngAnimate', 'mean.directives', 'mean.services', 'mean.configs']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'USER_ROLES', function($routeProvider, $locationProvider, $httpProvider, USER_ROLES) {
    $routeProvider.
        when('/about',{
            templateUrl:'/about'
        }).
        when('/contact',{
            templateUrl:'/contact'
        }).when('/blog', {
            controller: 'BlogListCtrl',
            resolve: {
                posts: ["MultiPostLoader", function(MultiPostLoader) {
                    return function(params){return MultiPostLoader(params);}
                }]
            },
            templateUrl:'/blog/index'
        }).when('/blog/:postId', {
            controller: 'BlogShowCtrl',
            resolve: {
                post: ["PostLoader", function(PostLoader) {
                    return PostLoader();
                }]
            },
            templateUrl:'/blog/show'
        }).otherwise({redirectTo:'/blog'});

        /*$locationProvider.html5Mode(true);*/
}]);

app.run(['$rootScope', '$location', 'AuthService', 'AUTH_EVENTS', function($rootScope, $location, AuthService, AUTH_EVENTS) {
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
app.controller('ApplicationController', ['$scope', function ($scope) {
    $scope.BlogCount = null;
    $scope.currentRoutePath = '/blog';

    $scope.$on('$routeChangeSuccess', function(evt, next, previous) {
        if(!!next.$$route){
            $scope.currentRoutePath = next.$$route.originalPath;
        }
        
    });

    $scope.setBlogCount = function (count) {
        $scope.BlogCount = count;
    };
}]);

app.controller('BlogListCtrl', ['$scope', 'posts', 'CUSTOM_EVENTS', function($scope, posts, CUSTOM_EVENTS) {
    /*$scope.posts = posts({});*/
    $scope.posts = [];
    function fetchPromise(params){
        return posts(params).then(function(result){
            $scope.posts = $scope.posts.concat(result);
            $scope.setBlogCount($scope.posts.length);
        },function(error){

        });
    };
    fetchPromise({skip: 0, limit: 12});

    $scope.$on(CUSTOM_EVENTS.loadMore, function(data){
        $scope.$emit(CUSTOM_EVENTS.loading);
        NProgress.start();
        setTimeout(function(){
            fetchPromise({skip: $scope.posts.length, limit: 12}).then(function(){
                $scope.$emit(CUSTOM_EVENTS.loaded);
                NProgress.done();
            });
        }, 500);
        
    });

}]);
app.controller('BlogShowCtrl', ['$scope', '$location', 'post', 'Post', 'AuthService', function($scope, $location, post, Post, AuthService) {
    $scope.post = new Post(post.data);
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