'use strict';

var services = angular.module('icyse-blog.services',
    ['ngResource', 'icyse-blog.configs']);

services.factory('MultiPostLoader', ['$http', '$q', function($http, $q) {
    return function(params) {
        var delay = $q.defer();
        return $http.get(params.url, { cache: true }).success(function(result){
            delay.resolve(result);
        }).error(function(){
            delay.reject('Unable to fetch posts');
        });
    };
}]);

services.factory('PostLoader', ['$http', '$route', '$q', function($http, $route, $q) {
    return function(params) {
        var delay = $q.defer();
        return $http.get(params.url + $route.current.params.alias + '.json',{ cache: true }).success(function(result){
            delay.resolve(result);
        }).error(function(){
            delay.reject('Unable to fetch post '  + $route.current.params.alias);
        });
    };
}]);

services.factory('Comment', ['$resource', function($resource) {
    return $resource('/comments/:id', {id: '@_id'}, { update: { method: 'PUT' } });
}]);