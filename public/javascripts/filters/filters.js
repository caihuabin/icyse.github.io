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

filters.filter('groupFilter', ['$rootScope', function ($rootScope) {    
    return function (data, group) {
        return data.reduce(function(prev, cur, index, array){
        	var i;
        	if(prev.some(function(item, index2, array2){
        		if(item.group === cur['group']){
        			i = index2;
        			return true;
        		}
        		else{
        			return false;
        		}
        		
        	})){
        		prev[i]['posts'].push(cur);
        	}
        	else{
        		prev.push({group: cur['group'], posts:[cur]});
        	}
        	return value;
        }, [{}]);
    };
}]);