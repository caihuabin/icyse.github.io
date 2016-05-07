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
        
        /*$locationProvider.html5Mode(false).hashPrefix('!');*/
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

app.controller('BlogListCtrl', ['$scope', 'posts', 'CUSTOM_EVENTS', '$filter', '$location', 'Utility', '$route', function($scope, posts, CUSTOM_EVENTS, $filter, $location, Utility, $route) {
    var responseData;
    var regularData;

    var urlParams;
    var search = $location.search();
    var searchParams = Utility.tools.deObject({
        skip: search.skip,
        limit: search.limit,
        category: search.category,
        searchText: search.searchText,
        orderBy: search.orderBy
    });
    var categoryFilter = function(item){
        return item.categoryList.indexOf(searchParams.category) > -1
    };
    var filters = function(data){
        var tempData = data;
        if(searchParams.hasOwnProperty('category')){
            tempData = $filter('filter')(tempData, categoryFilter);
        }
        if(searchParams.hasOwnProperty('searchText')){
            //tempData = $filter('filter')(tempData, {$: searchParams.searchText});
            tempData = $filter('filter')(tempData, {'title': searchParams.searchText});
        }

        if(searchParams.hasOwnProperty('orderBy')){
            tempData = $filter('orderBy')(tempData, [searchParams.orderBy, 'createdTime']);
        }
        return tempData;
    }

    function fetch(){
        if($scope.currentLanguage === 'en_US'){
            urlParams = {url:'/data/en_US/posts.json'};
        }
        else{
            urlParams = {url:'/data/zh_CN/posts.json'};
        }
        posts(urlParams).then(function(result){
            responseData = result.data;
            regularData = filters(responseData);
            $scope.postList = regularData.slice(0, 3);
        });
    }
    
    $scope.searchText = searchParams.searchText || '';
    $scope.search = function(){
        $location.path('/').search({searchText: $scope.searchText});
    };
    $scope.$on(CUSTOM_EVENTS.loadMore, function(data){
        $scope.$emit(CUSTOM_EVENTS.loading);
        NProgress.start();
        setTimeout(function(){
            var len = $scope.postList.length;
            $scope.postList = $scope.postList.concat(regularData.slice(len, len+3));
            $scope.$apply();
            $scope.$emit(CUSTOM_EVENTS.loaded);
            NProgress.done();
        }, 800);
    });
    $scope.$on(CUSTOM_EVENTS.changeLanguage, function(args, lang){
        /*$location.search('searchText', null);
        $route.reload();*/
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