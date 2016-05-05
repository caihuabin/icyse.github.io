'use strict';

var filters = angular.module('icyse-blog.filters', ['icyse-blog.configs']);

filters.filter('i18n', ['localizedTexts', '$rootScope', function (localizedTexts, $rootScope) {    
    return function (text) {
        var currentLanguage = $rootScope.language || 'en_US';
        
        if (localizedTexts[currentLanguage].hasOwnProperty(text)) {
            return localizedTexts[currentLanguage][text];
        }
        return text;
    };
}]);
