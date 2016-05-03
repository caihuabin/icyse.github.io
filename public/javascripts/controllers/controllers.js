'use strict';
var app = angular.module('icyse-blog', ['ngRoute', 'ngAnimate', 'pascalprecht.translate', 'icyse-blog.directives', 'icyse-blog.services', 'icyse-blog.configs', 'icyse-blog.filters']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$translateProvider', 'LOCALE_LANGUAGES', function($routeProvider, $locationProvider, $httpProvider, $translateProvider, LOCALE_LANGUAGES) {
    $routeProvider.
        when('/about',{
            templateUrl:'/views/about/index.html'
        }).when('/', {
            controller: 'BlogListCtrl',
            resolve: {
                posts: ["MultiPostLoader", function(MultiPostLoader) {
                    return function(params){return MultiPostLoader(params);}
                }]
            },
            templateUrl:'/views/blog/index.html'
        }).when('/:alias', {
            controller: 'BlogShowCtrl',
            resolve: {
                post: ["PostLoader", function(PostLoader) {
                    return function(params){return PostLoader(params);}
                }]
            },
            templateUrl:'/views/blog/show.html'
        }).otherwise({redirectTo:'/'});

        $translateProvider.translations('en_US', LOCALE_LANGUAGES.en_US);
        $translateProvider.translations('zh_CN', LOCALE_LANGUAGES.zh_CN);
        $translateProvider.preferredLanguage('zh_CN');
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
    $scope.currentLanguage = 'zh_CN';
    $scope.changeLanguage = function (lang) {
        if(lang === 'en_US'){
            $translate.use('en_US');
            $scope.currentLanguage = 'en_US';
            $rootScope.$broadcast(CUSTOM_EVENTS.changeLanguage, 'en_US');
        }
        else{
            $translate.use('zh_CN');
            $scope.currentLanguage = 'zh_CN';
            $rootScope.$broadcast(CUSTOM_EVENTS.changeLanguage, 'zh_CN');
        }
    };
}]);

app.controller('BlogListCtrl', ['$scope', 'posts', 'CUSTOM_EVENTS', function($scope, posts, CUSTOM_EVENTS) {
    var response;
    function fetch(){
        var params;
        if($scope.currentLanguage === 'en_US'){
            params = {url:'/data/en_US/posts.json'};
        }
        else{
            params = {url:'/data/zh_CN/posts.json'};
        }
        posts(params).then(function(result){
            $scope.postsList = result.data.slice(0, 2);
            response = result;
        });
    }
    
    $scope.$on(CUSTOM_EVENTS.loadMore, function(data){
        $scope.$emit(CUSTOM_EVENTS.loading);
        NProgress.start();
        setTimeout(function(){
            var len = $scope.postsList.length;
            $scope.postsList = $scope.postsList.concat(response.data.slice(len, len+2));
            $scope.$apply();
            $scope.$emit(CUSTOM_EVENTS.loaded);
            NProgress.done();
        }, 800);
    });
    $scope.$on(CUSTOM_EVENTS.changeLanguage, function(args, lang){
        fetch();
    });
    fetch();

}]);
app.controller('BlogShowCtrl', ['$scope', '$location', 'post', 'CUSTOM_EVENTS', function($scope, $location, post, CUSTOM_EVENTS) {
    function fetch(){
        var params;
        if($scope.currentLanguage === 'en_US'){
            params = {url:'/data/en_US/posts/'};
        }
        else{
            params = {url:'/data/zh_CN/posts/'};
        }
        post(params).then(function(result){
            $scope.post = result.data;
        });
    }
    $scope.$on(CUSTOM_EVENTS.changeLanguage, function(args, lang){
        fetch();
    });
    fetch();
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