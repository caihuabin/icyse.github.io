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
    blogPreviewClose: 'blog-preview-close'
});
