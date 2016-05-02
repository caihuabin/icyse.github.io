'use strict';

var configs = angular.module('mean.configs', []);

configs.constant('DOM_EVENTS', {
    onclick: 'onclick',
    onscroll: 'onscroll',
    onchange: 'onchange',
    click: 'click',
    scroll: 'scroll',
    change: 'change'
});

configs.constant('CUSTOM_EVENTS', {
    loadMore: 'load-more',
    loading: 'loading',
    loaded: 'loaded',
    loadOver: 'load-over',
    blogPreviewOpen: 'blog-preview-open',
    blogPreviewClose: 'blog-preview-close',
    changeLanguage: 'change-language'
});

configs.constant('LOCALE_LANGUAGE', {
    'zh_CN' : {
        'ENGLISH': '英文',
        'CHINESE': '中文'
    },
    'en_US' : {
        'ENGLISH': 'ENGLISH',
        'CHINESE': 'CHINESE'
   }
});