'use strict';

var services = angular.module('mean.services',
    ['ngResource', 'mean.configs']);

services.factory('Post', ['$resource', function($resource) {
    return $resource('/posts/:id', {id: '@_id'}, { update: { method: 'PUT' }, vote: { method: 'PUT', url: '/posts/vote/:id' } });
}]);

services.factory('MultiPostLoader', ['Post', '$q', function(Post, $q) {
    return function(params) {
        var delay = $q.defer();
        Post.query(params, function(posts) {
            delay.resolve(posts);
        }, function() {
            delay.reject('Unable to fetch posts');
        });
        return delay.promise;
    };
}]);

services.factory('PostLoader', ['Post', '$route', '$q', function(Post, $route, $q) {
    return function() {
        var delay = $q.defer();
        Post.get({id: $route.current.params.postId}, function(post) {
            delay.resolve(post);
        }, function() {
            delay.reject('Unable to fetch post '  + $route.current.params.postId);
        });
        return delay.promise;
    };
}]);

services.factory('Comment', ['$resource', function($resource) {
    return $resource('/comments/:id', {id: '@_id'}, { update: { method: 'PUT' } });
}]);