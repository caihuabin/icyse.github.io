'use strict';

var configs = angular.module('icyse-blog.configs', ['icyse-blog.services']);

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
configs.constant('CATEGORY_LIST', [
    "Algorithm",
    "AngularJs",
    "Canvas",
    "CSS",
    "Design",
    "GameJS",
    "Git",
    "HTML",
    "Icyse",
    "Interview",
    "JavaScript",
    "Linux",
    "MongoDB",
    "NodeJs",
    "React",
    "Uncategorized",
    "Wiki"
]);
configs.constant('LOCALE_LANGUAGES', {
    "zh_CN" : {
        "ENGLISH": "英文",
        "CHINESE": "中文"
    },
    "en_US" : {
        "ENGLISH": "ENGLISH",
        "CHINESE": "CHINESE"
   }
});